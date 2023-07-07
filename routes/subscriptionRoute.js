const express = require('express');
const Router = express.Router();
const commonMid = require('../middlwares/midd')
const multer = require('multer');
const update = multer();
const subscriptionController = require('../controller/subscriptionController');


Router.post('/addSubscriptionPlan',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin],  subscriptionController.add_subscription_plan);

Router.get('/getSubscriptionPlan',update.none(),[commonMid.verifyToken, commonMid.admin_seller], subscriptionController.get_subscription_plan)

Router.put('/updateSubscriptionPlan/:id',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin],  subscriptionController.update_subscriptin_plan)

Router.delete('/deleteSubscriptionPlan/:id',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin],  subscriptionController.delete_subscription_plan)

Router.post('/buyNow/:id',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin_seller], subscriptionController.buyNow);

Router.get('/totalRevenue',[commonMid.verifyToken,commonMid.authorize, commonMid.admin], subscriptionController.total_revenue )

module.exports = Router


