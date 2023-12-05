const express = require('express');
const Router = express.Router();


const faqController = require('../controller/faqControler');
const faqMidd = require('../middleware/faqMidd');

Router.post('/addUserFaq',[faqMidd.addfaq], faqController.addUserFaq);
Router.get('/getUserFaq', faqController.getUserFaq);
Router.put('/updateFaq',[faqMidd.update], faqController.updateFaq);
Router.delete('/deleteFaq', faqController.deleteFaq);
Router.post('/addVendorFaq',[faqMidd.addfaq], faqController.addVendorFaq);
Router.get('/getVendorFaq', faqController.getVendorFaq);
module.exports = Router;

