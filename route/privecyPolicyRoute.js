const express = require('express');
const Router = express.Router();

const privecyPolicyCon = require('../controller/privacyPolicyCon');

Router.put('/privecyPolicy', privecyPolicyCon.updatePrivacyPolicy);
Router.get('/getPrivecyPolicy', privecyPolicyCon.getPrivecyPolicy);

module.exports = Router;