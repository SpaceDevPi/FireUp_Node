const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Offerticket = new
    Schema(
        {
            idcoach: String,
            idoffer :{type: String, unique: true},
            idclient: String,
            numroom:Number,
            dateend:String,
            datestart:String,
            coachfullname:String,
            starttime:String,
            endtime:String,
            image:String,
            state:{type:String , default:'Ongoing'},
        },
        {
            timestamps: true
        }
    );
module.exports = mongoose.model('offerticket', Offerticket);