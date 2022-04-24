const express = require('express');
const colors = require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const getPriceFeed = require('./utils/scraping');
const Entrepreneur = require('./model/entrepreneurModel')
const Message = require('./model/message')
const dotenv = require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 5000;
const cookieSession = require('cookie-session');

// passport config
require('./passport')(passport);

connectDB();

const app = express();

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}))

getPriceFeed();

const rooms = ['general', 'enrepreneurs', 'investors', 'coachs', 'companies'];

const server = require('http').createServer(app);
// const io = socket(server);
const io = require('socket.io')(server, {
    cors : {
        origin : 'http://localhost:3000',
        methods : ['GET', 'POST'],
        
    }
});


// io.sockets.on('connection', (socket) => {
//     console.log('connected');
//     socket.on('new-user', async () => {
//         const members = await Entrepreneur.find();
//         io.emit('new-user', members);
//     })
// });



async function getMessagesFormRoom(room) {
    let roomMessages = await Message.aggregate([
        {$match: {to: room}},
    ])
    return roomMessages;
}


async function getLastMessagesFormRoom(room) {
    let roomMessages = await Message.aggregate([
        {$match: {to: room}},
        {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
    ])
    return roomMessages;
}

function sortRoomMessagesByDate(messages) {
    return messages.sort(function(a, b) {
        let date1 = a._id.split('/');
        let date2 = b._id.split('/');

        date1 = date1[2] + date1[0] + date1[1];
        date2 = date2[2] + date2[0] + date2[1];

        return date1 < date2 ? -1 : 1;
    }); 
}

// socket connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('get-messages', async (room) => {
        const messages = await getMessagesFormRoom(room);
        socket.emit('get-messages', messages);
    });

    socket.on('new-user', async () => {
        const members = await Entrepreneur.find();
        io.emit('new-user', members);
    })

    socket.on('room-messages', async (room) => {
        const messages = await getLastMessagesFormRoom(room);
        const sortedMessages = sortRoomMessagesByDate(messages);
        io.emit('room-messages', sortedMessages);
    })

    socket.on('join-room', async(room) => {
        socket.join(room);
        let roomMessages = await getLastMessagesFormRoom(room);
        roomMessages = sortRoomMessagesByDate(roomMessages);
        socket.emit('room-messages', roomMessages);
    })

    socket.on('message-room', async(room, content, sender, time, date ) => {
        const newMessage = await Message.create({content, from: sender, time, date, to: room});
        let roomMessages = await getLastMessagesFormRoom(room);
        roomMessages = sortRoomMessagesByDate(roomMessages);
        // sendeing message to room 
        io.to(room).emit('room-messages', roomMessages);

        socket.broadcast.emit('notifications', room)

    })

    socket.on('get-entrepreneur', async (id) => {
        const entrepreneur = await Entrepreneur.findById(id);
        socket.emit('get-entrepreneur', entrepreneur);
    })

    // app.delete('/api/logout', async (req, res) => {
    //     try{
    //         const {_id, newMessages} = req.body;
    //         const entrepreneur = await Entrepreneur.findById(_id);
    //         entrepreneur.status = "offline";
    //         // entrepreneur.newMessages = newMessages;
    //         console.log(entrepreneur);
    //         await entrepreneur.save();
    //         const members = await Entrepreneur.find();
    //         socket.broadcast.emit('new-user', members);
    //         res.status(200).send('logout');
    //     }catch(err){
    //         console.log(err);
    //         res.status(400).send(err);
    //     }
    // })

})

//session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());



app.use(errorHandler)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use("/api/auth",require("./routes/auth"));

app.get('/rooms', (req, res) => {
    res.json(rooms);
})

app.get('/messages', (req, res) => {
    let mesages = Message.find();
    res.json(mesages);
})
    
server.listen(PORT, () => {console.log('Server is running on port ' + PORT)});
