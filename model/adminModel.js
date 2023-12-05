const mongoose = require('mongoose');
const constant = require('../constant/constant');

const AdminSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    number : {
        type : Number
    },
    profileImage : {
        type : String
    },
    password : {
        type : String
    },
    userType : {
        type : String,
        default : constant.Admin
    }

},{timestamps : true});

module.exports = mongoose.model('Admin', AdminSchema)