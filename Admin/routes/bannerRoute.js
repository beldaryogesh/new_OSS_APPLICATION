const express = require("express");
const Router = express.Router();
const commonMid = require('../../middlwares/midd');
const bannerController = require("../controller/bannerController");

Router.post("/addBanner", [commonMid.verifyToken,commonMid.authorize, commonMid.admin], bannerController.add_banner);

Router.get("/getBannerList", [commonMid.verifyToken,commonMid.authorize, commonMid.admin], bannerController.get_banner);

Router.put("/updateBanner/:id", [commonMid.verifyToken,commonMid.authorize, commonMid.admin],bannerController.update_banner);

Router.delete('/deleteBanner/:id', [commonMid.verifyToken,commonMid.authorize, commonMid.admin], bannerController.delete_banner)

module.exports = Router;
