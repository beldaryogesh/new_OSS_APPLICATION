const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd');

const vender_service_Controller = require('../controller/vendor.Service.Controller');

Router.post('/addvendorservice', [commonMid.verifyToken, commonMid.authorize], vender_service_Controller.addService)

Router.get('/getVendorService', [commonMid.verifyToken, commonMid.authorize], vender_service_Controller.getService )

module.exports = Router;

