const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Article = new
    Schema(
        {
            coachfullname: String,
            Description: String,
            Title: String,
            Image :String,
            Likes: Number,
            Category:String,
            coachid:String,
            coachimage:String,
        },
        {
            timestamps: true
        }
    );
module.exports = mongoose.model('article', Article);