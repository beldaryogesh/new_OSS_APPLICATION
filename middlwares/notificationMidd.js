const UserNotificationModel = require('../User/models/UserNotificationModel');
const userModel = require('../User/models/userModel');

const vendorServiceNotification = async function (req, res, next) {
    try {
      const users = await userModel.find({});
      const vendorId = req.userId;
      const vendor = await userModel.findById(vendorId);
      const message = `${vendor.name} added new ${vendor.typeOfService} typeOfService, please check it..`;
  
      if (!users) {
        return res.status(200).send({error_code : 404, message: 'Users not found..!' });
      }
  
      for (const user of users) {
        if (user.userType === 'customer') {
          const timestamp = new Date();
          user.notification.unshift({message, time : timestamp});
          await user.save(); // Save each user individually
        }
      }
  
      console.log('Notifications saved for all customers.');
      console.log('Notifications sent successfully.')
   next()   
    } catch (error) {
      console.log(error);
      return res.status(500).send({error_code : 500, message: 'Error fetching user notifications..!' });
    }
};
 

const sendNotificationByAdmin = async function (req, res, next) {
  try {
    const users = await userModel.find({});
    const adminId = req.userId;
    const admin = await userModel.findById(adminId);
    const message = 'admin send email please check it..';

    if (!users) {
      return res.status(200).send({error_code : 404, message: 'Users not found..!' });
    }

    for (const user of users) {
      if (user.userType != 'admin') {
          const timestamp = new Date();
          user.notification.unshift({message, time : timestamp})
        await user.save(); 
      }
    }
    console.log('Notifications saved for all users by admin.');
    console.log('Notifications sent successfully.')
 next()   
  } catch (error) {
    console.log(error);
    return res.status(500).send({error_code : 500, message: 'Error fetching user notifications..!' });
  }
};


const profileUpdate = async function(req, res, next){
  try {
    let userId = req.userId;
    const user = await userModel.findById(userId)
    let message = 'profile update successfully..'
    const timestamp = new Date();
    user.notification.unshift({message : message, time: timestamp })
    user.save()
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside profile update middlware..!'})
  }
}

const updateService = async function(req, res){
  try {
    let userId = req.userId;
    const user = await userModel.findById(userId);
    let message = 'service update successfully..!'
    const timestamp = new Date();
    user.notification.unshift({message, time : timestamp})
    user.save()
    next()
  } catch (error) {
    console.log(error)
    return res.tatus(500).send({error_code : 500, message : 'error inside update service notification'});
  }
}


module.exports = {
  vendorServiceNotification,
  sendNotificationByAdmin,
  profileUpdate,
  updateService
}



