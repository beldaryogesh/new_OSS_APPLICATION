const constant = require('../constant/constant');
const Notification = require('../model/notificationModel');
const NotificationConstant = require('../constant/notificationConstant');
const mongoose = require('mongoose')
const User = require('../model/authModel');

const createNotification = async function(req, res){
    try {
        let obj = {
            section : req.body.section ? req.body.section : undefined,
            notificationTitle : req.body.notificationTitle ? req.body.notificationTitle : undefined,
            notificationType :  req.body.notificationType ? req.body.notificationType : undefined,
            description  :  req.body.description ? req.body.description : undefined,
        }        
       let user = await User.find({})
       if(req.body.section == constant.SelectAll){
        let userEmail = []
        for(let i =0; i<user.length; i++){
            userEmail.push(user[i].email)
            user[i].notification.unshift({
                message : `Hello Dear ${user[i].name}, You Received a Email Please Check it..!`,
                time : new Date()
            });
        }
        NotificationConstant.emailSender(userEmail,req.body);
        await Notification.create(obj);
       }
       if(req.body.section == constant.SelectAllUser){
        let userEmail = []
        for(let i =0; i<user.length; i++){
          if(user[i].userType == constant.User){
            userEmail.push(user[i].email)
            user[i].notification.unshift({
                message : `Hello Dear ${user[i].name}, You Received a Email Please Check it..!`,
                time : new Date()
            });
          }
        }
        NotificationConstant.emailSender(userEmail,req.body);
        await Notification.create(obj);
       }
       if(req.body.section == constant.SelectAllVendor){
        let userEmail = []
        for(let i =0; i<user.length; i++){
          if(user[i].userType == constant.Vendor){
            userEmail.push(user[i].email)
            user[i].notification.unshift({
                message : `Hello Dear ${user[i].name}, You Received a Email Please Check it..!`,
                time : new Date()
            });
          }
        }
        NotificationConstant.emailSender(userEmail,req.body);
        await Notification.create(obj);
       };
       if(req.body.section == constant.specificHost){
           let userIds = JSON.parse(req.body.selected);

           if (!Array.isArray(userIds)) {
               return res.status(400).json({ error_code: 400, message: 'User IDs must be provided as an array.' });
           }
           let userEmail = []
           for (let i = 0; i < userIds.length; i++) {
               new mongoose.Types.ObjectId(userIds[i])
               let user = await User.findOne({ _id: userIds[i] });
               user.notification.unshift({
                  message : `Hello Dear ${user.name}, You Received a Email Please Check it..!`,
                  time : new Date()
               });
            userEmail.push(user.email)
        }
        NotificationConstant.emailSender(userEmail,req.body);
        await Notification.create(obj);
       };
       return res.status(200).json({error_code : 200, message : 'Email Send Successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside create notification..!'})
    }
};


const getNameForEmail = async function(req, res){
    try {
        let user = await User.find({});
        let data = []
        for(let i=0; i<user.length; i++){
            data.push({
                name : user[i].name,
                UserId : user[i]._id
            })
        }
        return res.status(200).json({error_code : 200, data});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'eror inside get name for email..!'})
    }
};

const getNotificationList = async function(req, res){
    try {
        const notification = await Notification.find({});
        if(notification.length == 0){
            return res.status(200).json({error_code : 404, message : 'no notification exist..!'})
        }
        let data = [];
        let sr = 1
        for(let i=0; i<notification.length; i++){
           data.push({
            SrNo : sr++,
            SectionName : notification[i].section,
            NotificationTitle : notification[i].notificationTitle, 
            NotificationType : notification[i].notificationType,
            Description : notification[i].description,
            notificationId : notification[i]._id
           })
        };
        return res.status(200).json({error_code : 200, message : 'notification list', data})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside getNotificationList..!'})
    }
};

const deleteAdminNotification = async function (req, res){
    try {
        let notificationId = req.body.notificationId;
        let notification = await Notification.findOneAndDelete({_id : notificationId});
        if(!notification){
            return res.status(200).json({error_code : 200, message : 'notification not exist..!'})
        };
        return res.status(200).json({error_code : 200, message : 'Notification Delete Successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside deleteAdminNotification..!'})
    }
}

module.exports = {
    createNotification, 
    getNameForEmail,
    getNotificationList,
    deleteAdminNotification
}



