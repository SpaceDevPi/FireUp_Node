const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
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
    company: {
        type: String,
        required: true
    },
    companyAddress: {
        type: String,
        required: false
    },
    companyCity: {
        type: String,
        required: false
    },
    companyState: {
        type: String,  
        required: false
    },
    companyZip: {
        type: String,
        required: false
    },
    companyPhone: {
        type: String,
        required: false
    },
    companyEmail: {
        type: String,
        required: false
    },
    companyWebsite: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Contractor', contractorSchema);
