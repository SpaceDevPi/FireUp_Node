const mongoose = require('mongoose');

const entrepreneurSchema = mongoose.Schema({
    googleId:{
        type: String,
        required: false,
    },
    displayName:{
        type: String,
        required: false,
    },
    image:{
        type: String,
    },
    username: {
        type: String,
        required: false,
        unique: false
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        // validate(value) {
        //     if (!value.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
        //         throw new Error('Email is not valid.');
        //     }
        // }
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    villenaissance: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zip: {
        type: String,
        required: false
    },
    valid: {
        type: Boolean,
        default: false
    },
    newMessages : {
        type: Object,
        default: {}
    },
    status : {
        type: String,
        default: 'online'
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    }
    
},
{
    timestamps: true
});

module.exports = mongoose.model('Entrepreneur', entrepreneurSchema);