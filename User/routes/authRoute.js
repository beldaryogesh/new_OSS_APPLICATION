const express = require('express');
const Router = express.Router();
const authController = require('../controller/authController');
const middlwares = require('../../middlwares/midd')


Router.post('/register' , authController.registerUser);

Router.post('/loginUser', authController.loginUser)

Router.post('/verifyotp', [middlwares.verifyToken, middlwares.authorize], authController.verifyOtp)

module.exports = Router;



