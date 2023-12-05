const express = require('express');
const Router = express.Router();

const dashbordCon = require('../controller/dashbordController');


Router.get('/registerdVendor', dashbordCon.registerdVendor);
Router.get('/totalCustomer', dashbordCon.totalCustomer);
module.exports = Router;

