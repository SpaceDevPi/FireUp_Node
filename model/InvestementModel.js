const mongoose = require('mongoose')
var d = new Date();
var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const InvestementSchema = mongoose.Schema({
    idProject :{
        type : String, 
        required : true, 
    //    unique : true
    },

        
    idInvestisseur: {
        type : String, 
        required : true, 
        unique : true

     },
    monatantTotal: {
        type : Number, 
        required : true, 
       

    },
    montantInvesti: {
        type : Number, 
        required : true, 

    },
    dateInvestissement: {
        type : Date, 
        
        default : date
    },
    dateFin:{
        type : Date , 
        required : true

    }, 
    MethodeInvestissement: {
        type : String, 
        required: true

    }



})

module.exports = mongoose.model('investement', InvestementSchema)
