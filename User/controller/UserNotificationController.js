const UserNotificationModel = require("../models/UserNotificationModel");
const userModel = require('../models/userModel');

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
     const user = await userModel.findById(userId);
     if(user.notification.length == 0){
        return res.status(404).send({ message : 'no one notification is exist..!' })
     }
     return res.status(200).send({ notifictions : user.notification })
  
  } catch (error) {
    console.log(error)
    return res.status(500).send({message: "Error fetching user notifications..!"});
  }
};



exports.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params;
    const notification = await UserNotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).send({ message: "Notification not found..!" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).send({ message: "Error marking notification as read" });
  }
};
