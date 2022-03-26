const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({

    
    id_project: {
        type: String,
        required: [true, "Please enter project id !"],
        trim: true
    }, 
    title: {
        type: String,
        required: [true, "Please enter your first name!"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "Please enter content!"],
        trim: true
    },
    date: {
        type: Date,
        required: true,
      
      },
    images: {
       
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
        
       
    },
 




    



})

module.exports = mongoose.model('post', PostSchema)