const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    number: {
      type: Number,
  
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    profileImage: {
     type: String
    },
    registerWith : {
      type : String
    },
    Id : {
      type : String
    },
    otp: {
      type: ObjectId,
      ref: "Otp",
    },
    userType: {
      type: String,
      default: "customer",
      enum: ["vendor", "customer", "admin"],
    },
    address : {
      type : String
    },
    typeOfService: {
      type: String,
      trim: true,
    },
    storeName: {
      type: String,
      trim: true,
    },
    aadharCard: {
     type : String
    },
    panCard: {
     type : String
    },
    storeImages: [],
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    SubStartDate : {
      type : Date
    },
    expiryDate: {
      type: Date,
    },
    adminService: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Service",
    },
    adminBanners: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Banner",
    },
    adminSubscription: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Subscription",
    },
    vendorServices: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "VenderService",
    },
    notification: [{
      message : String,
      time : Date
    }],
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
