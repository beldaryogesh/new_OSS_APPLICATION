const express = require('express');
const Router = express.Router();

const termsConditionsCon = require('../controller/termsConditionsController')

Router.put('/termsConditions', termsConditionsCon.updateTermsConditionsCon);
Router.get('/getTermsConditions', termsConditionsCon.getTermsConditions);

module.exports = Router;