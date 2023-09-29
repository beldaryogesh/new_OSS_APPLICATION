const express = require('express');
const Router = express.Router();
const authController = require('../controller/authController');
const middlwares = require('../../middlwares/midd')
const auth_body = require('../../middlwares/auth.body')

Router.post('/register' , authController.registerUser);

Router.post('/loginUser', authController.loginUser)

Router.post('/verifyotp', [middlwares.verifyToken, middlwares.authorize], authController.verifyOtp)

Router.post('/loginWithGoogle', authController.loginWithGoogle)

Router.post('/loginWithFaceBook', authController.loginWithFaceBook)

Router.put('/registrationWithsocialMedia' ,authController.registrationWithsocialMedia);

Router.put('/sellerRegistration_1' , [middlwares.verifyToken, middlwares.authorize ],authController.sellerRegistration_1);

Router.put('/sellerRegistration_2' , [middlwares.verifyToken, middlwares.authorize ],authController.sellerRegistration_2);

Router.put('/address',  [middlwares.verifyToken, middlwares.authorize],authController.addAddress )
module.exports = Router;



