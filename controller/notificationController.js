const notificationModel = require('../models/notificationModel');
const nodemailer = require('nodemailer');
const { sectionRegex , notification_typeRegex , lengthRegex, subjectRegex } = require('../validations/validation');
const userModel = require('../models/userModel');

const add_notification = async function (req, res) {
    try {
        let data = req.body;
        let { section, title, notification_type, description, email } = data;
        data['sender'] = req.userId;
        if(!section){
            return res.status(400).send({
                message : 'please provide section'
            })
        }

        if(!sectionRegex.test(section)){
            return res.status(400).send({
                message : 'please only provide customer, vendor and email section..!'
            })
        }
        if(section == 'email'){
            if(!req.body.email){
                return res.status(400).send({
                    message : 'please provide email'
                })
            }
        }
        if(!title){
            return res.status(400).send({
                message : 'please provide title..!'
            })
        }
        if(!notification_type){
            return res.status(400).send({
                message : 'please provide notification Type..!'
            })
        }
        if(!notification_typeRegex.test(notification_type)){
            return res.status(400).send({
                message : 'please only provide email and sms notification type..!'
            })
        }
        if(!description){
            return res.status(400).send({
                message : 'please provide description..!'
            })
        }
        
        let obj = {};
        if(email) obj['email'] = email;
        let user = await userModel.find(obj)
        let userEmail = []
       let userId = []
        if(section != 'email'){
         for(let i= 0; i<user.length; i++){
            if(user[i].userType == section){
                userEmail.push(user[i].email)
                userId.push(user[i]._id)

            }
        }
    }else{
            userId.push(user[0]._id)
    }
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'checkdemo02@gmail.com',
              pass: 'vqdoqmekygtousli'
            }
          });
          const mailOptions = {
            from: 'checkdemo02@gmail.com',
            to: userEmail.length > 0 ? userEmail : email,
            subject: title,
            text: description
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });

          
       let notification = await notificationModel.create(data);

       for(let i=0; i<userId.length; i++){
         notification.recipient.push(userId[i])
        console.log(userId[i])
      }
       notification.save();
      // console.log(notification)
        return res.status(201).send({
            message : 'notification send successfully..!'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message : error.message
        })
    }
}


// Sr.No	Section Name	Notification Title	Notification Type	Description	Date
const get_notification = async function(req, res){
    try {
        let notification = await notificationModel.find({ })
        let result = [];
        let sr = 1;
        for(let i=0; i<notification.length; i++){
            result.push({
                SrNo : sr++,
               	SectionName : notification[i].section,
                NotificationTitle : notification[i].title,
                NotificationType : notification[i].notification_type,
                Description : notification[i].description,
                Date : notification[i].createdAt
            })
        }
        if(result.length == 0){
            return res.status(404).send({
                message : 'no one notification is exist..!'
            })
        }
        return res.status(200).send({
            message : 'notification List',
            data : result
        })
    } catch (error) {
        return res.status(500).send({
            message : error.message
        })
    }
}

const delete_notification = async function (req, res){
    try {
        let notificationId = req.params.id;
        let check_notification = await notificationModel.findById(notificationId);
        if(!check_notification){
            return res.status(404).send({
                message : 'notification not exist..!'
            })
        }
        await notificationModel.deleteOne({_id : notificationId})
        return res.status(200).send({
            message : 'notification delete successfully..!'
        })
    } catch (error) {
        return res.status(500).send({
            message : error
        })
    }
}

module.exports = {
    add_notification,
    get_notification,
    delete_notification
}