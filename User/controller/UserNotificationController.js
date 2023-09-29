const UserNotificationModel = require("../models/UserNotificationModel");
const userModel = require('../models/userModel');

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
     const user = await userModel.findById(userId);
     if(user.notification.length == 0){
        return res.status(200).send({error_code : 404, message : 'no one notification is exist..!' })
     }
     return res.status(200).send({error_code : 200, notifictions : user.notification })
  
  } catch (error) {
    console.log(error)
    return res.status(500).send({error_code : 500, message: "Error fetching user notifications..!"});
  }
};


exports.removeNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = req.body.notificationId;

    const user = await userModel.findById(userId);

    const notificationIndex = user.notification.findIndex((notification) => notification._id.toString() == notificationId);

    if (notificationIndex == -1) {
      return res.status(200).json({ error_code: 404, message: 'Notification not found' });
    } 
    user.notification.splice(notificationIndex, 1);
    await user.save();

    return res.status(200).json({ error_code: 200, message: 'Notification removed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error_code: 500, message: 'Error removing notification' });
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
      return res.status(200).send({error_code : 400, message: "Notification not found..!" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).send({error_code : 500, message: "Error marking notification as read" });
  }
};


