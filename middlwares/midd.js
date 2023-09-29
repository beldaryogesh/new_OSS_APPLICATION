const faqModel = require("../Admin/models/faqModel");
const userModel = require("../User/models/userModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  try {
    console.log("i am verify token");
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(200)
        .send({ error_code: 400, message: "no token provided, please provide token" });
    }
    jwt.verify(token, "one-stop-service", (err, decoded) => {
      if (err) {
        return res.status(200).send({ error_code: 401, message: "Unauthorized" });
      } else {
        req["userId"] = decoded.userId;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ error_code: 500, message: error.message });
  }
};

const authorize = async function (req, res, next) {
  try {
    console.log("i am authorize");

    let userId = req.userId;
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(200).send({ error_code: 404, message: "you are not registerd" });
    }
    if (userId != user._id) {
      return res.status(200).send({ error_code: 403, message: "provide your own token" });
    }
    let id = req.params.id;

    if (id != undefined) {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(200).send({
          error_code: 400,
          message: "please provide valid mongoose Id..!",
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).send({ error_code: 500, message: error.message });
  }
};

const admin = async function (req, res, next) {
  try {
    console.log("i am admin");

    let userId = req.userId;

    const user = await userModel.findById(userId);
    if (user.userType != "admin") {
      return res
        .status(200)
        .send({ error_code: 403, message: "only admin can access this api" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ error_code: 500, message: error.message });
  }
};

const admin_seller = async function (req, res, next) {
  try {
    console.log("i am admin_seller");
    let userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.userType == "customer") {
      return res.status(200).send({
        error_code: 403,
        message: "only admin and seller can access this api",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error_code: 500, status: false, message: error.message });
  }
};

const checkVendorSubscription = async function (req, res, next) {
  try {
    const vendorId = req.userId;
    const vendor = await userModel.findById(vendorId);

    if (!vendor.subscriptionId) {
      return res
        .status(200)
        .send({
          error_code: 400,
          message:
            "you have not taken subscription, take subscription then you can add service..😀",
        });
    }
    let message = "your subscription plan is expired..";
    if (!vendor.subscriptionId || vendor.expiryDate < Date.now()) {
      vendor.notification.unshift(message);
      vendor.save();
      return res
        .status(200)
        .send({ error_code: 403, message: "Your subscription has expired. Please renew it." });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .send({ error_code: 500, message: "Error checking vendor subscription status." });
  }
};

module.exports = {
  verifyToken,
  authorize,
  admin,
  admin_seller,
  checkVendorSubscription,
};
