const mongoose = require("mongoose");

const UserNotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  content: [], // Notification content
  isRead: { 
   type: Boolean,
   default: false 
  }, // Flag to mark if the notification has been read
},{timestamp : true});

module.exports = mongoose.model("UserNotification", UserNotificationSchema);
