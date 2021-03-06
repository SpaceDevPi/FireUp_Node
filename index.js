const express = require("express");
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
var CoachRouter = require("./routes/coach");
var ArticleRouter = require("./routes/article");
var OfferRouter = require("./routes/offer");
var Offerticket = require("./routes/offerticket");
var Stars = require("./routes/stars");
const getPriceFeed = require("./utils/scraping");
const Entrepreneur = require("./model/entrepreneurModel");
const Message = require("./model/message");

// var meet = require('./routes/meet');
const path = require("path");

const passport = require("passport");
const session = require("express-session");
const cookieSession = require("cookie-session");

// passport config
require("./passport")(passport);

connectDB();

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let socketList = {};
app.use(express.static(path.join(__dirname, "public")));

app.get("/ping", (req, res) => {
  res
    .send({
      success: true,
    })
    .status(200);
});

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

getPriceFeed();

const rooms = ["general", "enrepreneurs", "investors", "coachs", "companies"];

async function getMessagesFormRoom(room) {
  let roomMessages = await Message.aggregate([{ $match: { to: room } }]);
  return roomMessages;
}

async function getLastMessagesFormRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

// Socket
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("User disconnected!");
  });

  socket.on("BE-check-user", ({ roomId, userName }) => {
    let error = false;

    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit("FE-error-user-exist", { error });
    });
  });

  /**
   * Join Room
   */
  socket.on("BE-join-room", ({ roomId, userName }) => {
    // Socket Join RoomName
    socket.join(roomId);
    socketList[socket.id] = { userName, video: true, audio: true };

    // Set User List
    io.sockets.in(roomId).clients((err, clients) => {
      try {
        const users = [];
        clients.forEach((client) => {
          // Add User List
          users.push({ userId: client, info: socketList[client] });
        });
        socket.broadcast.to(roomId).emit("FE-user-join", users);
        // io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {
        io.sockets.in(roomId).emit("FE-error-user-exist", { err: true });
      }
    });
  });

  socket.on("BE-call-user", ({ userToCall, from, signal }) => {
    io.to(userToCall).emit("FE-receive-call", {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on("BE-accept-call", ({ signal, to }) => {
    io.to(to).emit("FE-call-accepted", {
      signal,
      answerId: socket.id,
    });
  });

  socket.on("BE-send-message", ({ roomId, msg, sender }) => {
    io.sockets.in(roomId).emit("FE-receive-message", { msg, sender });
  });

  socket.on("BE-leave-room", ({ roomId, leaver }) => {
    delete socketList[socket.id];
    socket.broadcast
      .to(roomId)
      .emit("FE-user-leave", { userId: socket.id, userName: [socket.id] });
    io.sockets.sockets[socket.id].leave(roomId);
  });

  socket.on("BE-toggle-camera-audio", ({ roomId, switchTarget }) => {
    if (switchTarget === "video") {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit("FE-toggle-camera", { userId: socket.id, switchTarget });
  });

  // chat entrepreneur
  socket.on("get-messages", async (room) => {
    const messages = await getMessagesFormRoom(room);
    socket.emit("get-messages", messages);
  });

  socket.on("new-user", async () => {
    const members = await Entrepreneur.find();
    io.emit("new-user", members);
  });

  socket.on("room-messages", async (room) => {
    const messages = await getLastMessagesFormRoom(room);
    const sortedMessages = sortRoomMessagesByDate(messages);
    io.emit("room-messages", sortedMessages);
  });

  socket.on("join-room", async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFormRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on('message-room', async(room, content, sender, senderName, time, date ) => {
    const newMessage = await Message.create({content, from: sender, senderName, time, date, to: room});
    let roomMessages = await getLastMessagesFormRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sendeing message to room 
    io.to(room).emit('room-messages', roomMessages);

    socket.broadcast.emit("notifications", room);
  });

  socket.on("get-entrepreneur", async (id) => {
    const entrepreneur = await Entrepreneur.findById(id);
    socket.emit("get-entrepreneur", entrepreneur);
  });
});

//session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(errorHandler);
// app.set('socketio', io);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/contractors", require("./routes/contractorRoutes"));
app.use("/api/entrepreneurs", require("./routes/entrepreneurRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/investors", require("./routes/investorRoutes"));
app.use("/api/investement", require("./routes/investementRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentsRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/events", require("./routes/eventsRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use('/api/coach', CoachRouter);
app.use('/api/articles', ArticleRouter);
app.use('/api/offers', OfferRouter);
app.use('/api/offerticket', Offerticket);
app.use('/api/projectlive', require('./routes/projectLiveRoutes'))
app.use("/api/stars", Stars);
// app.use('/api/meet', meet);


app.use("/api/auth", require("./routes/auth"));

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

app.get("/messages", (req, res) => {
  let mesages = Message.find();
  res.json(mesages);
});

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
