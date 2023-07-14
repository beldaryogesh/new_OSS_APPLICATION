const faqModel = require("../Admin/models/faqModel");
const userModel = require("../User/models/userModel");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  try {
    console.log('i am verify token')
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ message: "no token provided, please provide token" });
    }
    jwt.verify(token, "one-stop-service", (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      } else {
        req["userId"] = decoded.userId;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const authorize = async function (req, res, next) {
  try {
    console.log("i am authorize")

    let userId = req.userId;
    let user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).send({ message: "you are not registerd" });
    }
    if (userId != user._id) {
      return res.status(403).send({ message: "provide your own token" });
    }
    let id = req.params.id;

    if(id != undefined){
      if(!mongoose.isValidObjectId(id)){
        return res.status(400).send({
          message : 'please provide valid mongoose Id..!'
        })
      }
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


const admin = async function (req, res, next) {
  try {
    console.log('i am admin')
  
    let userId = req.userId;
  
    const user = await userModel.findById(userId);
    if (user.userType != "admin") {
      return res
        .status(403)
        .send({ status: false, message: "only admin can access this api" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const admin_seller = async function (req, res, next) {
  try {
    console.log('i am admin_seller')
    let userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.userType == "customer") {
      return res.status(403).send({
        status: false,
        message: "only admin and seller can access this api",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
  verifyToken,
  authorize,
  admin,
  admin_seller
};



