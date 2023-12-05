const express = require('express');
const Router = express.Router();


const contactCon = require('../controller/contactManegement');
const contactMidd = require('../middleware/contactMidd');

Router.post('/userContact', [contactMidd.addContactUs], contactCon.addUserContactUs);
Router.get('/getUserContactDetails', contactCon.getUserContact);
Router.put('/updateContactDetails', [contactMidd.updateContactDetails], contactCon.updateContactDetails);
Router.delete('/deleteContactDetails', contactCon.deleteContactDetails);
Router.put('/updateUserContactStatus', [contactMidd.status], contactCon.updateUserContactStatus)
Router.post('/vendorContact', [contactMidd.addContactUs], contactCon.addVendorContactUs);
Router.get('/getVendorContactDetails', contactCon.getVendorContact);
Router.put('/updateVendorContactStatus', [contactMidd.status], contactCon.updateVendorContactStatus);


module.exports = Router

