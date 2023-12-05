const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const constant = require('../constant/constant');

const userSchema = new mongoose.Schema({
    name : {
        type : String
    },
    number : {
        type : Number
    },
    email : {
        type : String
    },
    state : {
        type : String
    },
    city : {
        type : String
    },
    Id : {
        type : String
    },
    profileImage : {
        type : String
    },
    language : {
        type : String
    },
    registerWith : {
        type : String,
        enum : [constant.Google, constant.FaceBook]
    },
    userType: {
        type: String,
        enum: [constant.User, constant.Vendor],
        default : constant.User
    },
    status: {
        type: String,
        enum: [constant.Active, constant.Deactivate, constant.Pending],
        default : constant.Active
    },
    aadharStatus : {
        type: String,
        enum: [constant.Verify, constant.Reject, constant.Pending],
        default : constant.Pending
    },
    panStatus : {
        type: String,
        enum: [constant.Verify, constant.Reject, constant.Pending],
        default : constant.Pending
    },
    address : {
        type : String
    },
    whereDoYouWork : {
        type : String
    },
    notification: [{
        message : String,
        time : Date
    }],
    latitude : {
        type: Number,
        min: -90,  
        max: 90,
    },
    longitude : {
        type: Number,
        min: -90,  
        max: 90,
    },
    companyName : {
        type : String
    },
    serviceType : {
        type : String
    },
    businessProfileImage : {
        type : String
    },
    aadharCard : {
        type : String
    },
    panCard : {
        type : String
    },
    addressProof : {
        type : String
    },
    bannerImage : [],
    serviceImage : [],
    leads : [{
        time : Date,
        serviceType : String,
        userName : String,
        address : String,
        number : Number
    }],
    // views : [{
    //     time : Date,
    //     userRequirement : String,
    //     userName : String,
    //     address : String,
    //     number : Number
    // }]
    
}, {timestamps : true});

module.exports = mongoose.model('User', userSchema);
