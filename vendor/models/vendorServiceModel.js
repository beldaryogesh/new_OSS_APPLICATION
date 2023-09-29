const mongoose = require("mongoose");

const venderService = new mongoose.Schema(
  {
    storeName: {
      type: String,
      require: true,
    },
    profileImage : {
      type : String
    },
    storeImages: [],
    number: {
      type: Number,
      require: true,
      trim: true,
    },
    typeOfService: {
      type: String,
      trim: true,
    },
    address : {
      type : String
    },
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: Number,
      trim: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    serviceViewdUser: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
    },
    customer : {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VenderService", venderService);
