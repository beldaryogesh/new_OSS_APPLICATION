const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd');
const midd = require('../../middlwares/notificationMidd');
const vendorLeadController = require('../../vendor/controller/vendorLeadController');

Router.post('/createVendorLead', [ commonMid.verifyToken, commonMid.authorize ], vendorLeadController.createVendorLead)
Router.get('/getTodayLeads', [ commonMid.verifyToken, commonMid.authorize ], vendorLeadController.getTodayLeads);
Router.get('/getYesterdayLeads',[ commonMid.verifyToken, commonMid.authorize ], vendorLeadController.getYesterdayLeads);
Router.get('/getPreviousLeads', [ commonMid.verifyToken, commonMid.authorize ], vendorLeadController.getPreviousLeads);
Router.get('/getLeadsByDate', [ commonMid.verifyToken, commonMid.authorize ], vendorLeadController.getLeadsByDate);
Router.get('/totalLeads', [commonMid.verifyToken, commonMid.authorize], vendorLeadController.total_lead);




module.exports = Router;