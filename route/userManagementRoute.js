const express = require('express');
const Router = express.Router();

const userManagementCon = require('../controller/userManagement');
const userMidd = require('../middleware/userMidd');

Router.get('/userList', userManagementCon.userList);
Router.delete('/deleteUser', userManagementCon.deleteUser);
Router.put('/userUpdatByAdmin', [userMidd.updateUser], userManagementCon.userUpdate);

module.exports = Router;