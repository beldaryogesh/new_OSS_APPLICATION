const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    number: {
      type: Number,
      require: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    address: {
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
    image: {
      fileName: {
        type: String,
      },
      fileAddress: {
        type: String,
      },
    },
    otp: {
      type: ObjectId,
      ref: "Otp",
    },
    userType: {
      type: String,
      default: "customer",
      enum : ["vendor", "customer", "admin"]
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    expiryDate: {
      type: Date,
    },
    adminService: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Service",
    },
    adminBanners : {
      type : [mongoose.Schema.Types.ObjectId],
      ref : "Banner"
    },
    adminSubscription : {
      type : [mongoose.Schema.Types.ObjectId],
      ref : "Subscription"
    }
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
