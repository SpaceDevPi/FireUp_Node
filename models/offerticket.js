const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Offerticket = new
    Schema(
        {
            idcoach: String,
            idoffer :String,
            idclient: String,
            numroom:Number,
            dateoffer:String,
            timeoffer:String,
            coachfullname:String,
            clientfullname:String,
            offertitle:String,
            checked: {type:String,default:"Unseen"},
            image:String,
            state:{type:String , default:'Ongoing'},
        },
        {
            timestamps: true
        }
    );
module.exports = mongoose.model('offerticketss', Offerticket);

