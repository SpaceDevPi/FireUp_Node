const mongoose = require('mongoose')

const commentsSchema = mongoose.Schema({

    
    id_project: {
        type: String,
        required: [true, "Please enter project id !"],
        trim: true
    }, 
    id_user: {
        type: String,
        required: [true, "Please enter your id_user!"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "Please enter content!"],
        trim: true
    },
    date: {
        type: Date,
        default: new Date(),
      
      },
      parentId: {
        type: String,
        required: [true, "Please enter parentId!"],
        trim: true
    },




    



})

module.exports = mongoose.model('comments', commentsSchema)