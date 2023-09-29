const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd')
const notification = require('../../middlwares/notificationMidd');

const adminController = require('../controller/adminController')


Router.post('/createAdmin', adminController.create_admin);

Router.post('/loginAdmin', adminController.admin_login)

Router.put('/updateAdmin',[commonMid.verifyToken, commonMid.authorize, commonMid.admin, notification.profileUpdate],adminController.update_admin);

Router.delete('/deleteAdmin',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], adminController.delete_admin)

module.exports = Router;