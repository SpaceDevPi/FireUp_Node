const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Stars = new
    Schema(
        {
            idoffer: String,
            stars: Number,
        },
        {
            timestamps: true
        }
    );
module.exports = mongoose.model('stars', Stars);