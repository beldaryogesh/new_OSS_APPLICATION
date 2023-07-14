const mongoose = require("mongoose");

const venderService = new mongoose.Schema({
  categoryName: {
    type: String,
    require: true,
    trim: true,
  },
  serviceName: {
    type: String,
    require: true,
  },
  image: {
    fileName: {
      type: String,
    },
    fileAddress: {
      type: String,
    },
  },
  number: {
    type: Number,
    require: true,
    trim: true,
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
});

module.exports = mongoose.model("VenderService", venderService);