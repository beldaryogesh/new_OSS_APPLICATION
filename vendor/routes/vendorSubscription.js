const express = require('express');
const Router = express.Router();
const commonMidd = require('../../middlwares/midd')
const subscriptionController = require('../controller/vendorSubscriptionController');

Router.post('/buySubscription/:id' ,[commonMidd.verifyToken, commonMidd.authorize, commonMidd.admin_seller],subscriptionController.buySubscription);

Router.get('/mySubscription', [commonMidd.verifyToken, commonMidd.authorize, commonMidd.admin_seller], subscriptionController.mySubcription);

Router.put('/renewSubscription', [commonMidd.verifyToken, commonMidd.authorize, commonMidd.admin_seller], subscriptionController.renewSubscription);

module.exports = Router;