const mongoose = require('mongoose');


const companySchema = mongoose.Schema({
    companyName: {
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
        required: false
    },
    companyDescription: {
        type: String,
        required: false
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
    },
    companySize: {
        type: String,
        required: false
    },
    entrepreneur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrepreneur',
        required: true
    }
},
{
    timestamps: true
});


module.exports = mongoose.model('Company', companySchema);

