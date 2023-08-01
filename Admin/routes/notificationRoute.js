const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd')
const notificationMidd = require('../../middlwares/notificationMidd');


const notificatioController = require('../controller/notificationController');

Router.post('/addnotification',[commonMid.verifyToken, commonMid.authorize, commonMid.admin, notificationMidd.sendNotificationByAdmin], notificatioController.add_notification);

Router.get('/getnotification',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], notificatioController.get_notification );

Router.delete('/deletenotification/:id', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], notificatioController.delete_notification );

module.exports = Router;