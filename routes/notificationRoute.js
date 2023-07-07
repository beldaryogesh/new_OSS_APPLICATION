const express = require('express');
const Router = express.Router();
const multer = require('multer');
const update = multer();
const commonMid = require('../middlwares/midd')

const notificatioController = require('../controller/notificationController');

Router.post('/addnotification',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin], notificatioController.add_notification);

Router.get('/getnotification',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], notificatioController.get_notification );

Router.delete('/deletenotification/:id', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], notificatioController.delete_notification );

module.exports = Router;