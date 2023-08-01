const express = require('express');
const Router = express.Router();
const UserNotificationController = require('../controller/UserNotificationController');
const commonMid = require('../../middlwares/midd')


Router.get('/getnotifications' , [ commonMid.verifyToken, commonMid.authorize], UserNotificationController.getUserNotifications );

Router.post('/notification/mark-read/:id', [ commonMid.verifyToken, commonMid.authorize ], UserNotificationController.markNotificationAsRead);

module.exports = Router;



