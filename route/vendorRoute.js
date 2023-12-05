const express = require('express');
const Router = express.Router();

const vendorCon = require('../controller/vendorController');
const verifyToken = require('../middleware/verifyToken');
const vendorAuthMidd = require('../middleware/vendorAuthMidd');
const notificationMidd = require('../middleware/notificationMidd');

Router.get('/getSubscriptionPlan', [verifyToken.authenticateUser, vendorAuthMidd.checkDocumentVerification], vendorCon.getSubscriptionPlanByVendor);
Router.post('/buySubscription',[verifyToken.authenticateUser], vendorCon.buySubscription);
Router.get('/totalLeads', [verifyToken.authenticateUser], vendorCon.totalLeads);
// Router.get('/totalViwes', [verifyToken.authenticateUser], vendorCon.totalViwes);
Router.get('/todayLeads', [verifyToken.authenticateUser], vendorCon.todayLeads);
// Router.get('/todayViews', [verifyToken.authenticateUser], vendorCon.totalViwes);
Router.get('/getTodayLeads', [verifyToken.authenticateUser], vendorCon.getTodayLeads);
Router.get('/getYesterdayLeads', [verifyToken.authenticateUser], vendorCon.getYesterdayLeads);
Router.get('/getPreviousLeads', [verifyToken.authenticateUser], vendorCon.getPreviousLeads);
Router.get('/getLeadsByDate', [verifyToken.authenticateUser], vendorCon.getLeadsByDate);
Router.get('/leadsViewMore', [verifyToken.authenticateUser], vendorCon.leadsViewMore);
Router.get('/getVendorProfile', [verifyToken.authenticateUser], vendorCon.getVendorProfile);
Router.put('/updateVendor', [verifyToken.authenticateUser, vendorAuthMidd.update, notificationMidd.profileUpdate], vendorCon.updateVendor);
Router.get('/getFaqByVendor', vendorCon.getFaqByVendor);
Router.put('/updateVendorDocument', [verifyToken.authenticateUser, notificationMidd.documentUpdate], vendorCon.updateDocuments);
Router.get('/vendorContactUs', vendorCon.vendorContactUs);
module.exports = Router;