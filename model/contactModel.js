const mongoose = require('mongoose');
const constant = require('../constant/constant');

const contactSchema = new mongoose.Schema({
    number : {
        type : Number
    },
    address : {
        type : String
    },
    status: {
        type: String,
        enum: [constant.Active, constant.Deactivate],
        default : constant.Deactivate
    },
    userType : {
        type : String,
        enum : [constant.User, constant.Vendor]
    }
}, {timestamps : true});

module.exports = mongoose.model('Contact', contactSchema);


