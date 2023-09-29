const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd');
const usercontroller = require('../controller/userController');
const adminController = require('../../Admin/controller/serviceController')
const notification = require('../../middlwares/notificationMidd');
const bannerController = require('../../User/controller/bannerController');

Router.put('/userUpdate',[commonMid.verifyToken, commonMid.authorize, notification.profileUpdate ],  usercontroller.update_user)
Router.put('/vendorUpdate',[commonMid.verifyToken, commonMid.authorize, notification.profileUpdate ],  usercontroller.update_vendor)
Router.delete('/deleteUser',[commonMid.verifyToken, commonMid.authorize], usercontroller.delete_user)

// customer api
Router.get('/customerList', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.get_customer_list);
Router.delete('/deleteUser/:id',[commonMid.verifyToken,commonMid.authorize, commonMid.admin], usercontroller.delete_user_by_admin)
Router.get('/getService', [commonMid.verifyToken, commonMid.authorize], usercontroller.get_admin_service );
Router.get('/getStateList', usercontroller.stateList);
Router.get('/getCityList', usercontroller.cityList);
Router.get('/getFaqByCustomer',[commonMid.verifyToken, commonMid.authorize ], usercontroller.get_costomer_faq);

// vendor api
Router.get('/vendorList',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.get_vendor_list);
Router.delete('/deleteVendor/:id',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.delete_user_by_admin);

// banner api

Router.get('/get-user-banner',  [commonMid.verifyToken, commonMid.authorize], bannerController.getBanner)
Router.get('/getuserById',  [commonMid.verifyToken, commonMid.authorize], usercontroller.getUserById)

module.exports = Router;