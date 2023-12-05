const mongoose = require('mongoose');
const constant = require('../constant/constant');

const faqSchema = new mongoose.Schema({
    question : {
        type : String
    },
    answer : {
        type : String
    },
    userType : {
        type : String,
        enum : [constant.User, constant.Vendor]
    }
}, {timestamps : true});

module.exports = mongoose.model('Faq', faqSchema);
