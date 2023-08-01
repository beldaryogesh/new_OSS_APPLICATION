const UserNotificationModel = require('../User/models/UserNotificationModel');
const userModel = require('../User/models/userModel');

const vendorServiceNotification = async function (req, res, next) {
    try {
      const users = await userModel.find({});
      const vendorId = req.userId;
      const vendor = await userModel.findById(vendorId);
      const message = `${vendor.name} added new ${vendor.typeOfService} typeOfService, please check it..😀`;
  
      if (!users) {
        return res.status(404).send({ message: 'Users not found..!' });
      }
  
      for (const user of users) {
        if (user.userType === 'customer') {
          user.notification.unshift(message);
          await user.save(); // Save each user individually
        }
      }
  
      console.log('Notifications saved for all customers.');
      console.log('Notifications sent successfully.')
   next()   
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Error fetching user notifications..!' });
    }
};
 

const sendNotificationByAdmin = async function (req, res, next) {
  try {
    const users = await userModel.find({});
    const adminId = req.userId;
    const admin = await userModel.findById(adminId);
    const message = `${admin.name} admin send email please check it..😀`;

    if (!users) {
      return res.status(404).send({ message: 'Users not found..!' });
    }

    for (const user of users) {
      if (user.userType != 'admin') {
        user.notification.unshift(message);
        await user.save(); 
      }
    }
    console.log('Notifications saved for all users by admin.');
    console.log('Notifications sent successfully.')
 next()   
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error fetching user notifications..!' });
  }
};



module.exports = {
  vendorServiceNotification,
  sendNotificationByAdmin
}



