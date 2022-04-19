const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Offerticket = new
    Schema(
        {
            idcoach: String,
            idoffer :{type: String, unique: true},
            idclient: String,
            numroom:Number,
            dateoffer:String,
            timeoffer:String,
            coachfullname:String,
       
            image:String,
            state:{type:String , default:'Ongoing'},
        },
        {
            timestamps: true
        }
    );
module.exports = mongoose.model('offerticket', Offerticket);