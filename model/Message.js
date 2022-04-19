const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: String,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrepreneur',
        required: true
    },
    socketId: String,
    time: String,
    date: String,
    to: String
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;