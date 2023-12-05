const express = require('express');
const Router = express.Router();


const notificationController = require('../controller/notificationController');
const adminNotificationMidd = require('../middleware/adminNotificationMidd');

Router.post('/sendNotificationbyAdmin', [adminNotificationMidd.checkNotificationBody],notificationController.createNotification);
Router.get('/getNameForEmail', notificationController.getNameForEmail);
Router.get('/getNotificationList', notificationController.getNotificationList);
Router.delete('/deleteAdminNotification', notificationController.deleteAdminNotification);

module.exports = Router;


