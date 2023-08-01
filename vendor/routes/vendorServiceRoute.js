const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd');
const vender_service_Controller = require('../../vendor/controller/vendorServiceController');

Router.post('/addvendorservice', [ commonMid.verifyToken, commonMid.authorize, commonMid.checkVendorSubscription ], vender_service_Controller.add_service)

Router.get('/getVendorService', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.getService );

Router.put('/update-servce/:id',[ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.update_service);

Router.get('/total-store', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.totale_stores );

Router.get('/get-most-used-service', [ commonMid.verifyToken, commonMid.authorize ], vender_service_Controller.getMostUseServices);

Router.get('/getContactViews', [commonMid.verifyToken, commonMid.authorize], vender_service_Controller.contactViews );

module.exports = Router;

