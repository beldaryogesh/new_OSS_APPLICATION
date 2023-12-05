const express = require('express');
const Router = express.Router();

const userController = require('../controller/userController');
const userMidd = require('../middleware/userMidd');
const verifyToken = require('../middleware/verifyToken');
const notification = require('../middleware/notificationMidd');

Router.get('/getBannerByUser', userController.getBanner);
Router.get('/homeService', userController.homeService);
Router.get('/mostUsedService', userController.homeService);
Router.get('/getFaqByUser', userController.getFaqByUser);
Router.get('/termsAndCondition', userController.termsAndCondition);
Router.get('/privacyPolicy', userController.privacyPolicy);
Router.put('/userUpdate',[verifyToken.authenticateUser, userMidd.updateUser, notification.profileUpdate], userController.userUpdate);
Router.get('/userProfile',[verifyToken.authenticateUser], userController.userProfile);
Router.get('/userContactUs', userController.userContactUs);
Router.get('/notification', [verifyToken.authenticateUser], userController.notification);
Router.delete('/removeNotifications', [verifyToken.authenticateUser], userController.removeNotifications);
Router.post('/searchServices',[verifyToken.authenticateUser], userController.searchService);
Router.post('/getVendorServices', [verifyToken.authenticateUser], userController.getVendorServices);
Router.post('/viewMore',[verifyToken.authenticateUser], userController.viewMore);
Router.post('/addnotifcationforcheck', notification.addNotification);



module.exports = Router;