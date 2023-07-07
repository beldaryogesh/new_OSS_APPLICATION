const express = require("express");
const Router = express.Router();
const multer = require("multer");
const commonMid = require('../middlwares/midd')
const bannerController = require("../controller/bannerController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const upload = multer({ storage: storage });

Router.post("/addBanner", upload.single('image'), [commonMid.verifyToken,commonMid.authorize, commonMid.admin], bannerController.add_banner);

Router.get("/getBannerList", [commonMid.verifyToken,commonMid.authorize, commonMid.admin], bannerController.get_banner);

Router.put("/updateBanner/:id",upload.single("image"), [commonMid.verifyToken,commonMid.authorize, commonMid.admin],bannerController.update_banner);

Router.delete('/deleteBanner/:id', [commonMid.verifyToken,commonMid.authorize, commonMid.admin], bannerController.delete_banner)

module.exports = Router;
