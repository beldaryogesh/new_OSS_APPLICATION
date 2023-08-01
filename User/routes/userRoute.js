const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd');
const usercontroller = require('../controller/userController');
const adminController = require('../../Admin/controller/serviceController')
Router.put('/userUpdate/',[commonMid.verifyToken, commonMid.authorize],  usercontroller.update_user)
Router.delete('/deleteUser',[commonMid.verifyToken, commonMid.authorize], usercontroller.delete_user)

// customer api
Router.get('/customerList', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.get_customer_list);
Router.delete('/deleteUser/:id',[commonMid.verifyToken,commonMid.authorize, commonMid.admin], usercontroller.delete_user_by_admin)
Router.get('/getService', [commonMid.verifyToken, commonMid.authorize], adminController.get_service );

// vendor api
Router.get('/vendorList',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.get_vendor_list);
Router.delete('/deleteVendor/:id',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.delete_user_by_admin);


module.exports = Router;