const express = require('express');
const Router = express.Router();

const authCon = require('../controller/authController');
const authMidd = require('../middleware/authMidd');
const verifyToken = require('../middleware/verifyToken');

Router.post('/register',[authMidd.register], authCon.register);
Router.post('/verifyOtp',[verifyToken.authenticateUser], authCon.verifyOtp);
Router.put('/address',[verifyToken.authenticateUser, authMidd.address], authCon.address);
Router.get('/stateList', authCon.stateList);
Router.post('/cityList', authCon.cityList);
Router.post('/userLogin', authCon.login);
Router.post('/loginWithGoogle', authCon.loginWithGoogle);
Router.post('/loginWithFaceBook', authCon.loginWithFaceBook);
Router.put('/registrationWithsocialMedia',[authMidd.register], authCon.registrationWithsocialMedia);

module.exports = Router;