const subscriptionModel = require("../models/subscription");
const userModel = require("../../User/models/userModel");
const serviceModel = require('../models/serviceModel');

const {
  nameRegex,
  statusRegex
} = require("../../validations/validation");

const add_subscription_plan = async function (req, res) {
  try { 
    let data = req.body;
    let adminId = req.userId;
    if (!data) {
      return res.status(400).send({
        status: false,
        message: "please provide data for create subscription..!",
      });
    }
    let {
      serviceName,  
      subscriptionName,
      description,
      subscriptionPrice,
      subscriptionValidity,
      status
    } = data;
    let admin = await userModel.findById(adminId);
    let subscription = await subscriptionModel.find({ subscriptionName : subscriptionName});
    let service = await serviceModel.find({ })
    if(!serviceName){
      return res.status(400).send({
        message : 'please provide category name..!'
      })
    }
    if(!nameRegex.test(serviceName)){
      return res.status(400).send({
        message : 'category name should contain alphabets only..!'
      })
    }
    let ser = [];
    let flag = 0;
    for(let i=0; i<service.length; i++){
      if(service[i].serviceName == serviceName){
        flag++
      }
      ser.push(service[i].serviceName)
    }
    if(flag != 1){
      return res.status(400).send({
        message : `${serviceName} category not exist, you only provide subscription for this ${ser} services..!`
      })
    }
    if(!service){
      return res.status(400).send({
        message : `${serviceName} category not exist, please add ${serviceName} service than you are able to add plan..!`
      })
    }
    if (!subscriptionName) {
      return res
        .status(400)
        .send({ status: false, message: "please provide subscription name..!" });
    }
    
    for(let i=0; i<subscription.length; i++){
      if(subscription[i].subscriptionName == subscriptionName){
        return res.status(400).send({
          status : false, 
          message : `${subscriptionName} is already exist, please provide unique subscription name..!`
        })
      }
    }
    if (!description) {
      return res
        .status(400)
        .send({ status: false, message: "please provide description..!" });
    }
    if (!subscriptionPrice) {
      return res
        .status(400)
        .send({ status: false, message: "please provide subscription..!" });
    }
    if (!Number(subscriptionPrice)) {
      return res.status(400).send({
        status: false,
        message: "please provide valid price(numaric format)..!",
      });
    }
    if (!subscriptionValidity) {
      return res.status(400).send({
        status: false,
        message: "please provide subscription duration..!",
      });
    }
    if(!status){
      return res.status(400).send({
        message : 'please provide status..!'
      })
    }
    if(!statusRegex.test(status)){
      return res.status(400).send({
        message : 'status should be contain Activated and Deactivated..!'
      })
    }
    let obj = {
      adminId : adminId,
      serviceName : serviceName,
      PlanName : subscriptionName,
      validity : subscriptionValidity,
      amount : subscriptionPrice,
      status : status,
      description : description
    }
    let create_subscription = await subscriptionModel.create(data);
    admin.adminSubscription.push(create_subscription._id);
    admin.save();
    return res.status(201).send({
      status: true,
      message: "subscription added successfully",
      data: obj,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, message: error.message });
  }
};

const get_subscription_plan = async function (req, res) {
  try {
    let subscription = await subscriptionModel.find({});
    let sr = 1;
    let result = [];
    for(let i=0; i<subscription.length; i++){
     result.push({
      SrNo : sr++,
      ServiceName : subscription[i].serviceName,
      PlanName : subscription[i].subscriptionName,
      validity : subscription[i].subscriptionValidity,
      Amount : subscription[i].subscriptionPrice,
      Status : subscription[i].status
     })
    }
    if (result.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "no subscription plan avalable" });
    }
    return res.status(200).send({
      status: true,
      message: "subscription plans",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const update_subscriptin_plan = async function (req, res) {
  try {
    let data = req.body;
    let subscriptionId = req.params.id;
    if (!data) {
      return res
        .status(400)
        .send({ message: "please provide data for update subscription" });
    }
    let {
      serviceName,
      subscriptionName,
      description,
      subscriptionPrice,
      subscriptionValidity,
      status
    } = data;
    let obj = {};
    let subscription = await subscriptionModel.findById(subscriptionId);
    let service = await serviceModel.find({ })
    if(serviceName != undefined){
      if(!serviceName){
        return res.status(400).send({
          message : 'please provide service name..!'
        })
      }
      if(!nameRegex.test(serviceName)){
        return res.status(400).send({
          message : 'service name should be contain alphabets only..!'
        })
      }
      let ser = [];
      let flag = 0;
      for(let i=0; i<service.length; i++){
        if(service[i].serviceName == serviceName){
          flag++
        }
        ser.push(service[i].serviceName)
      }
      if(flag != 1){
        return res.status(400).send({
          message : `${serviceName} category not exist, you only provide subscription for this ${ser} services..!`
        })
      }
      if(!service){
        return res.status(400).send({
          message : `${serviceName} service not exist, please add ${serviceName} service than you are able to add plan..!`
        })
      }
      obj['serviceName'] = serviceName;
    }
    if (subscriptionName != undefined) {
      if (!subscriptionName) {
        return res
          .status(400)
          .send({ message: "please provide subscription name" });
      }
      if (!nameRegex.test(subscriptionName)) {
        return res
          .status(400)
          .send({ message: "subscription name contain alfabets only" });
      }
      if (subscription.subscriptionName == subscriptionName) {
        return res.status(400).send({
          status: false,
          message: `${subscriptionName} is already exist please provide unique subscription name`,
        });
      }
      obj["planName"] = subscriptionName;
    }
    if (description != undefined) {
      if (!description) {
        return res.status(400).send({ message: "please provide description" });
      }
      obj["description"] = description;
    }
    if (subscriptionPrice != undefined) {
      if (!subscriptionPrice) {
        return res.status(400).send({
          message: "please provide subscription price",
        });
      }
      if (!Number(subscriptionPrice)) {
        return res
          .status(400)
          .send({ message: "please provide numaric price" });
      }
      if (subscription.subscriptionPrice == subscriptionPrice) {
        return res.status(400).send({
          status: false,
          message: `${subscriptionPrice} is already exist please rpovide unique subscription price`,
        });
      }
      obj["amount"] = subscriptionPrice;
    }
    if (subscriptionValidity != undefined) {
      if (!subscriptionValidity) {
        return res.status(400).send({
          message: "please provide subscription month",
        });
      }
      if (!Number(subscriptionValidity)) {
        return res
          .status(400)
          .send({ message: "please provide valid value in month formate" });
      }
      if (subscription.subscriptionValidity == subscriptionValidity) {
        return res.status(400).send({
          status: false,
          message: `${subscriptionValidity} is already exist please provide another subscription duration`,
        });
      }
      obj["validity"] = subscriptionValidity;
    }
    if(status != undefined){
      if(!status){
        return res.status(400).send({
          message : 'please provide status..!'
        })
      }
      if(!statusRegex.test(status)){
        return res.status(400).send({
          message : 'status should be contain Activated and Deactivated..!'
        })
      }
      obj['status'] = status;
    }

    await subscriptionModel.findByIdAndUpdate(
      { _id: subscriptionId },
      { $set: obj },
      { new: true }
    );
    return res.status(201).send({
      status: true,
      message: "subcription plan update successfully",
      data: obj,
    });
    console.log(obj)
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const delete_subscription_plan = async function (req, res) {
  try {
    let subscriptionId = req.params.id;
    let adminId = req.userId;
    let admin = await userModel.findById(adminId);
    let subscription = await subscriptionModel.findById(subscriptionId);
    if(!subscription){
      return res.status(400).send({
        message : 'subscription plan is not exist..!'
      })
    }
    let index = 0;
    await subscriptionModel.deleteOne(
      { _id: subscriptionId }
    );
    for (let adminId of admin["adminSubscription"]) {
      if (adminId == subscriptionId) break;
      index++;
    }
    admin["adminSubscription"].splice(index, 1);
    admin.save();
    return res
      .status(200)
      .send({ status: true, message: "subscription plan delete successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const total_revenue = async function (req, res) {
  try {
    let subscription = await subscriptionModel.find({});
    let revenue = 0;
    for (let i = 0; i < subscription.length; i++) {
      revenue +=
        subscription[i].userSubscription.length *
        subscription[i].subscriptionPrice;
    }
    return res
      .status(200)
      .send({ status: true, message: "total revenue", revenue: revenue });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  add_subscription_plan,
  get_subscription_plan,
  update_subscriptin_plan,
  delete_subscription_plan,
  total_revenue,
};
