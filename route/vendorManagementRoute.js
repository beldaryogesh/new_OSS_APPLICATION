const express = require('express');
const Router = express.Router();


const vendorManagementCon = require('../controller/vendorManagement');
const vendorManagementMidd = require('../middleware/vendorManagementMidd');

Router.get('/getVendorList', vendorManagementCon.getVendorList);
Router.delete('/deleteVendor', vendorManagementCon.deleteVendor);
Router.get('/vendorDetailsByAdmin', vendorManagementCon.vendorDetails);
Router.get('/getTodayLeadsByAdmin', vendorManagementCon.getTodayLeadsByAdmin);
Router.get('/getPreviousLeads', vendorManagementCon.getPreviousLeadsByAdmin);
Router.delete('/deleteLeadByAdmin', vendorManagementCon.deleteLeadByAdmin);
Router.get('/getAadharAndPanCard', vendorManagementCon.getAadharAndPanCard);
Router.put('/updateDocumentStatus', [vendorManagementMidd.updateDocumentStatus], vendorManagementCon.updateDocumentStatus);

module.exports = Router;