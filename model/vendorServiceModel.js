const mongoose = require('mongoose');
const constant = require('../constant/constant');

const vendorServiceSchema = new mongoose.Schema({
    bannerImage : [],
    companyName : {
        type : String
    },
    whereDoYouWork : {
        type : String
    },
    serviceType : {
        type : String
    },
    number : {
        type : Number
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    vendorAddress : {
        type : String
    },
    logoImage : {
        type : String
    },
    time : {
        type : String
    },
    serviceImage : [],
    location: {
        type: {
          type: String,
          enum: ["Point"], 
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
        },
    },
} ,{timestamps : true});

vendorServiceSchema.index({ location: '2dsphere' });


module.exports = mongoose.model('Vendorservice', vendorServiceSchema)