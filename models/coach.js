const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Coach = new
    Schema(
        {
            
            FirstName: String,
            Lastname: String,
            Adress: String,
            Email :{type: String, unique: true},
            Dateofbirth: String,
            Password:String,
            image:String,
            CV:String,
            Number:String,
            verified: { type: Boolean, default: false },
            verifiedadmin: { type: Boolean, default: false },


        },
        {
            timestamps: true
        }
    );
module.exports = mongoose.model('coachs', Coach);