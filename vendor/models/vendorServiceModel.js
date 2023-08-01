const mongoose = require("mongoose");

const venderService = new mongoose.Schema({
  storeName: {
    type: String,
    require: true,
  },
  storeImages: {
    fileName: {
      type: [String],
    },
    fileAddress: {
      type: [String],
    },
  },
  number: {
    type: Number,
    require: true,
    trim: true,
  },
  typeOfService: { 
    type : String,
    trim : true
  },
  serviceAddress: {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  serviceViewdUser : {
    type : [mongoose.Schema.Types.ObjectId],
    ref : 'user'
  }
}, {timestamps : true});

module.exports = mongoose.model("VenderService", venderService);