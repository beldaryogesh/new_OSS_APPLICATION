const express = require('express');
const Router = express.Router();
const multer = require('multer');
const update = multer();

const commonMid = require('../middlwares/midd');

const terms_condition_controller = require('../controller/Terms&ConditionController');


Router.post('/addtermscondition',update.none(), [commonMid.verifyToken, commonMid.authorize, commonMid.admin], terms_condition_controller.add_terms_Condition);

Router.put('/updatetermscondition/:id',update.none(), [commonMid.verifyToken, commonMid.authorize, commonMid.admin], terms_condition_controller.updateTermsCondition)

module.exports = Router;