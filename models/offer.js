const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Offer = new
    Schema(
        {
            idcoach: String,
            type: String,
            title: String,
            category :String,
            description: String,
            rating:String,
            dateend:String,
            datestart:String,
            price:Number,
            image:String,
            state: {type:String,default:"Available"},
            coachfullname:String,
            starttime:String,
            endtime:String,
            weekend: {type:Boolean,default:true},

        },
        {
            timestamps: true
        }
    );
module.exports = mongoose.model('offers', Offer);