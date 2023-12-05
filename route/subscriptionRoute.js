const express = require('express');
const Router = express.Router();


const Subscription = require('../controller/subscriptionController');
const subscriptionMidd = require('../middleware/subscriptionMidd');

Router.post('/addSubscription', [subscriptionMidd.addSubscription], Subscription.addSubscription);
Router.get('/getServiceName', Subscription.getServiceName);
Router.get('/getSubscription',Subscription.getSubscription);
Router.put('/updateSubscription',[subscriptionMidd.updateSubscription], Subscription.updateSubscription);
Router.put('/updateSubscriptionStatus',[subscriptionMidd.updateStatus], Subscription.updateStatus);
Router.delete('/deleteSubscription', Subscription.deleteSubscription);

module.exports = Router;

