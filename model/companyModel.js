const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    },
    companyDescription: {
        type: String,
        required: true
    },
    companyLogo: {
        type: String,
        required: false
    },
    companyBanner: {
        type: String,
        required: false
    },
    companyServices: {
        type: String,
        required: false
    },
    companyServicesDescription: {
        type: String,
        required: false
    },
    companyDomain: {
        type: String,
        required: false
    }
});

exports.Company = mongoose.model('Company', companySchema);

