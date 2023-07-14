const express = require('express');
const Router = express.Router()

const serviceController = require('../controller/serviceController')
const commonMid = require('../../middlwares/midd')



Router.post('/addService', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], serviceController.add_service)

Router.get('/getService',[commonMid.verifyToken, commonMid.authorize ], serviceController.get_service)

Router.put('/updateService/:id', [commonMid.verifyToken, commonMid.authorize, commonMid.admin], serviceController.update_service)

Router.delete('/deleteService/:id', [commonMid.verifyToken, commonMid.authorize, commonMid.admin],serviceController.delete_service)


module.exports = Router;








