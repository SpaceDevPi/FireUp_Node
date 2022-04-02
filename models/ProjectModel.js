const mongoose = require('mongoose')

const ProjectSchema = mongoose.Schema({

    
      
    title: {
        type: String,
        required: [true, "Please enter your first name!"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter your last name!"],
        trim: true
    },
    start_date: {
        type: Date,
        required: true,
      
      },
     end_date: {
        type: Date,
        required: [true, "Please enter date of end"]
      
      },

    amount_to_collect: {
        type: Number,
        required: [true, "Please enter  amount_to_collect! "]
    },
    collected_amount: {
        type: Number,
    },
    likes: {
        type: Number,
      
        
    },
    images: {
       
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
        
       
    },
    state: {
        type: String,
        default : "in progress"
        
    },
    offering_type: {
        type: String,
        required: [true, "Please enter type !"]
        
    },
    contractor_id: {
        type: String,
        default : "1"
        
    },
    category: {
        type: String,
        required: [true, "Please enter category  !"]
        
    },
    price_per_share: {
        type: Number,
        
    },    
    place: {
        type: String,
        required: [true, "Please enter place  !"]
        
    }
, email: {
        type: String,
        required: [true, "Please enter email  !"]
        
    }, 

    
    montantRestant: {
        type : Number, 
        default : -1, 
    },



    



})

module.exports = mongoose.model('project', ProjectSchema)