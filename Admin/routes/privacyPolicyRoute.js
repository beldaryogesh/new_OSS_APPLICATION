const express = require('express');
const Router = express.Router();
const multer = require('multer');
const update = multer();

const commonMid = require('../../middlwares/midd');

const privacy_policy_controller = require('../controller/privacyPolicyController');


Router.post('/addprivacypolicy', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], privacy_policy_controller.add_privacy_policy);

Router.put('/updateprivactpolicy/:id', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], privacy_policy_controller.update_privacy_policy)

module.exports = Router;