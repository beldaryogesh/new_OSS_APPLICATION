const mongoose = require('mongoose');
const constant = require('../constant/constant');

const notificationSchema = new mongoose.Schema({
    section : {
        type : [String],
        enum : [constant.SelectAll, constant.SelectAllUser, constant.SelectAllVendor, constant.specificHost]
    },
    selected : {
        type : [String]
    },
    notificationTitle : {
        type : String
    },
    notificationType : {
        type : String
    },
    description : {
        type : String
    }
}, {timestamps : true});


module.exports = mongoose.model('Notification', notificationSchema)