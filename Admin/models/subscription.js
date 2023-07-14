const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const subscriptionSchema = new mongoose.Schema(
  {
    adminId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'user'
    },
    categoryName : {
      type : String,
      require : true,
      trim : true
    },
    subscriptionName: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    subscriptionPrice: {
      type: Number,
      require: true,
      trim: true,
    },
    status : {
      type : String,
      enum : ['Activated', 'Deactivated']
    },
    userSubscription: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
    },
    subscriptionValidity: {
      type: Number,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);