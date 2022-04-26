const express = require('express');
const colors = require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
var CoachRouter = require('./routes/coach');
var ArticleRouter = require('./routes/article');
var OfferRouter = require('./routes/offer');
var Offerticket = require('./routes/offerticket');
var Stars = require('./routes/stars');

// var meet = require('./routes/meet');
const path = require('path');

connectDB();

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
let socketList = {};
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ping', (req, res) => {
    res
      .send({
        success: true,
      })
      .status(200);
  });
  
  // Socket
  io.on('connection', (socket) => {
    console.log(`New User connected: ${socket.id}`);
  
    socket.on('disconnect', () => {
      socket.disconnect();
      console.log('User disconnected!');
    });
  
    socket.on('BE-check-user', ({ roomId, userName }) => {
      let error = false;
  
      io.sockets.in(roomId).clients((err, clients) => {
        clients.forEach((client) => {
          if (socketList[client] == userName) {
            error = true;
          }
        });
        socket.emit('FE-error-user-exist', { error });
      });
    });
  
    /**
     * Join Room
     */
    socket.on('BE-join-room', ({ roomId, userName }) => {
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
          socket.broadcast.to(roomId).emit('FE-user-join', users);
          // io.sockets.in(roomId).emit('FE-user-join', users);
        } catch (e) {
          io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
        }
      });
    });
  
    socket.on('BE-call-user', ({ userToCall, from, signal }) => {
      io.to(userToCall).emit('FE-receive-call', {
        signal,
        from,
        info: socketList[socket.id],
      });
    });
  
    socket.on('BE-accept-call', ({ signal, to }) => {
      io.to(to).emit('FE-call-accepted', {
        signal,
        answerId: socket.id,
      });
    });
  
    socket.on('BE-send-message', ({ roomId, msg, sender }) => {
      io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
    });
  
    socket.on('BE-leave-room', ({ roomId, leaver }) => {
      delete socketList[socket.id];
      socket.broadcast
        .to(roomId)
        .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
      io.sockets.sockets[socket.id].leave(roomId);
    });
  
    socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
      if (switchTarget === 'video') {
        socketList[socket.id].video = !socketList[socket.id].video;
      } else {
        socketList[socket.id].audio = !socketList[socket.id].audio;
      }
      socket.broadcast
        .to(roomId)
        .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
    });
  });











// app.set('socketio', io);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/contractors', require('./routes/contractorRoutes'));
app.use('/api/entrepreneurs', require('./routes/entrepreneurRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/investors' , require('./routes/investorRoutes'))
app.use('/api/investement' , require('./routes/investementRoutes')) 
app.use('/api/project' , require('./routes/projectRoutes'))
app.use('/api/post' , require('./routes/postRoutes'))
app.use('/api/comments' , require('./routes/commentsRoutes'))
app.use('/uploads', express.static("uploads"));
app.use("/api/events", require("./routes/eventsRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use('/api/coach', CoachRouter);
app.use('/api/articles', ArticleRouter);
app.use('/api/offers', OfferRouter);
app.use('/api/offerticket', Offerticket);
app.use('/api/stars', Stars);

// app.use('/api/meet', meet);
app.use(errorHandler)

http.listen(PORT, () => {console.log('Server is running on port ' + PORT)});