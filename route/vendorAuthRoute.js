const express = require('express');
const Router = express.Router();

const vendorAuthCon = require('../controller/vendorAuth');
const vendorMidd = require('../middleware/vendorAuthMidd');
const verifyToken = require('../middleware/verifyToken');

Router.post('/businessDetails', [vendorMidd.businessDetails], vendorAuthCon.businessDetails);
Router.put('/selectLanguage',[verifyToken.authenticateUser], vendorAuthCon.selectLanguage);
Router.get('/getServiceType', vendorAuthCon.getServiceType);
Router.put('/whereDoYouWork', [verifyToken.authenticateUser], vendorAuthCon.whereDoYouWork);
Router.put('/selectServiceType', [verifyToken.authenticateUser], vendorAuthCon.selectServiceType);
Router.put('/uploadDocuments', [verifyToken.authenticateUser], vendorAuthCon.uploadDocuments);
Router.put('/vendorRegistrationWithsocialMedia', [vendorMidd.businessDetails], vendorAuthCon.registrationWithsocialMedia);
Router.get('/getFilldetails',[verifyToken.authenticateUser], vendorAuthCon.getFilldetails);
module.exports = Router;