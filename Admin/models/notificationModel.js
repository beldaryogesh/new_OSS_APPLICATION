const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["vendor", "customer", "email"],
    },
    email : {
        type : String
    },
    title : {
        type : String,
        require : true
    },
    notification_type : {
        type : String,
        enum : ['email', 'sms']
    },
    description : {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    recipient: {
      type:[ mongoose.Schema.Types.ObjectId],
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
