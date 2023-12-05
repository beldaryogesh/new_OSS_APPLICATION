const mongoose = require('mongoose');
const constant = require('../constant/constant');

const SubscriptionSchema = new mongoose.Schema({
    planName : {
        type : String
    },
    description : {
        type : String
    },
    serviceType : {
        type : String
    },
    planValidity : {
        type : String,
        enum : [constant.Monthly, constant.Quarterly, constant.Yearly]
    },
    amount : {
        type : Number
    },
    status : {
        type : String,
        enum : [constant.Active, constant.Deactivate],
        default : constant.Deactivate
    }
}, {timestamps : true});


module.exports = mongoose.model('Subscription', SubscriptionSchema)