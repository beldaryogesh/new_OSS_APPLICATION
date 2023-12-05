const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    serviceName : {
        type : String
    },
    serviceImage : {
        type : String
    },
    description : {
        type : String
    },
    usageCount: {
        type: Number,   // buy subscription
        default: 0,
    },
}, {timestamps : true});


module.exports = mongoose.model('AdminService', ServiceSchema);

