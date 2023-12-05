const express = require('express');
const Router = express.Router();


const AdminService = require('../controller/adminServiceController');
const adminServiceMidd = require('../middleware/adminServiceMidd');

Router.post('/addAdminService',[adminServiceMidd.addService], AdminService.addService );
Router.get('/getAdminService', AdminService.getAdminService);
Router.put('/updateAdminService',[adminServiceMidd.update], AdminService.updateAdminService);
Router.delete('/deleteAdminService', AdminService.deleteAdminService);
module.exports = Router;

