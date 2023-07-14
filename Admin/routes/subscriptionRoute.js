const express = require('express');
const Router = express.Router();
const commonMid = require('../../middlwares/midd')
const subscriptionController = require('../controller/subscriptionController');


Router.post('/addSubscriptionPlan',[commonMid.verifyToken, commonMid.authorize, commonMid.admin],  subscriptionController.add_subscription_plan);

Router.get('/getSubscriptionPlan',[commonMid.verifyToken, commonMid.admin_seller], subscriptionController.get_subscription_plan)

Router.put('/updateSubscriptionPlan/:id',[commonMid.verifyToken, commonMid.authorize, commonMid.admin],  subscriptionController.update_subscriptin_plan)

Router.delete('/deleteSubscriptionPlan/:id',[commonMid.verifyToken, commonMid.authorize, commonMid.admin],  subscriptionController.delete_subscription_plan)

Router.post('/buyNow/:id',[commonMid.verifyToken, commonMid.authorize, commonMid.admin_seller], subscriptionController.buyNow);

Router.get('/totalRevenue',[commonMid.verifyToken,commonMid.authorize, commonMid.admin], subscriptionController.total_revenue);

module.exports = Router


