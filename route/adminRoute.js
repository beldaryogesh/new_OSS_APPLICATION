const express = require('express');
const Router = express.Router();

const commonMidd = require('../middleware/verifyToken');
const Admin = require('../controller/adminController');
const adminMidd = require('../middleware/adminMidd');

Router.post('/createAdmin',[adminMidd.createAdmin], Admin.createAdmin);
Router.post('/adminLogin', [adminMidd.adminLogin], Admin.adminLogin);
Router.put('/updateAdmin',[commonMidd.authenticateUser, adminMidd.updateAdmin], Admin.updateAdmin);
Router.put('/changePassowrd', [commonMidd.authenticateUser, adminMidd.password], Admin.change_password)
Router.get('/getAdminProfile', [commonMidd.authenticateUser], Admin.getAdminProfile);


module.exports = Router;
