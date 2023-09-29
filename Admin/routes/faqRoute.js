const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd')

const faqController = require('../controller/faqController');


Router.post('/addFaq',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], faqController.add_faq);

Router.get('/getCustomerFaq',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], faqController.get_costomer_faq);

Router.get('/getVendorFaq',[commonMid.verifyToken, commonMid.authorize, commonMid.admin ], faqController.get_vendor_faq);

Router.put('/updateFaq/:id',[commonMid.verifyToken, commonMid.authorize, commonMid.admin ], faqController.update_faq );

Router.delete('/deletFaq/:id',[commonMid.verifyToken, commonMid.authorize, commonMid.admin ], faqController.delete_faq);

Router.put('/replyFaq',[commonMid.verifyToken, commonMid.authorize, commonMid.admin],faqController.reply_faq )

module.exports = Router;
