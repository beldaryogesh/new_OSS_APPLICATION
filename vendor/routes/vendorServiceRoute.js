const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd');
const notification = require('../../middlwares/notificationMidd');
const vender_service_Controller = require('../controller/vendorServiceController');
const userController = require('../../User/controller/UserNotificationController');

Router.post('/addvendorservice', [ commonMid.verifyToken, commonMid.authorize, commonMid.checkVendorSubscription, notification.vendorServiceNotification], vender_service_Controller.add_service)

Router.get('/getVendorService', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.getService );

Router.put('/update-servce',[ commonMid.verifyToken, commonMid.authorize, notification.updateService ], vender_service_Controller.update_service);

Router.get('/total-store', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.totale_stores );

Router.get('/totalCustomer', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.totalCustomer );

Router.get('/customer', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.customer );

Router.get('/get-most-used-service', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.getMostUseServices);

Router.get('/getContactViews', [commonMid.verifyToken, commonMid.authorize], vender_service_Controller.contactViews );

Router.get('/get-vendor-notification', [commonMid.verifyToken, commonMid.authorize], userController.getUserNotifications);

Router.get('/getVendorServiceById', [commonMid.verifyToken, commonMid.authorize],vender_service_Controller.getVendorServiceById)

Router.get('/getServiceName', [commonMid.verifyToken, commonMid.authorize],vender_service_Controller.getServiceName)


module.exports = Router;