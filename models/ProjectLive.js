const mongoose = require('mongoose')

const ProjectLiveSchema = mongoose.Schema({

    
   
    link: {
        type: String,
    
    },
    idproject: {
        type: String,
      
    },
    date: {
        type: Date,
      
    },
    state: {
        type: String,
        
      
    },
    contractor_id: {
        type: String,
        
      
    },
})
module.exports = mongoose.model('ProjectLive', ProjectLiveSchema)