const express = require('express');
const Router = express.Router()

const bannerCon = require('../controller/bannerController');
const bannerMidd = require('../middleware/bannerMidd');
const subscriptionMidd = require('../middleware/subscriptionMidd');

Router.post('/createBanner',[bannerMidd.checkBannerBody], bannerCon.createBanner);
Router.get('/getBanner', bannerCon.getBanner);
Router.put('/updateBanner',[bannerMidd.checkBody], bannerCon.updateBanner);
Router.put('/updateBannerStatus',[subscriptionMidd.updateStatus], bannerCon.updateStatus);
Router.delete('/deleteBanner', bannerCon.deleteBanner);

module.exports = Router;


