const serviceModel = require("../models/serviceModel");
const userModel = require("../../User/models/userModel");
const baseUrlUtils = require('../../middlwares/baseURL')


const { nameRegex } = require("../../validations/validation");

const add_service = async function (req, res) {
  try {
    let data = req.body;
    let adminId = req.userId;
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    if (!data) {
      return res.status(400).send({
        status: false,
        message: "please provide a data for add services",
      });
    }
    let { serviceName, description } = data;
    let admin = await userModel.findById(adminId);
    let service = await serviceModel.findOne({serviceName : serviceName})
    let obj = {};
    if (!serviceName) {
      return res
        .status(400)
        .send({ status: false, message: "please provide service name" });
    }
    if (!nameRegex.test(serviceName)) {
      return res.status(400).send({
        status: false,
        message: "service name should contain alphabets only.",
      });
    }
    if(service){
      return res.status(400).send({
        message : 'you already provide this service..!'
      })
    }
    obj["serviceName"] = serviceName;
    if (!description) {
      return res
        .status(400)
        .send({ status: false, message: "please provide description" });
    }
    obj["description"] = description;
    if (req.files.length <= 1) {
      obj["serviceImage"] = baseUrl + '/uploads/' +  req.files[0].filename
    }
    let add_service = await serviceModel.create(obj);
    admin.adminService.push(add_service._id);
    
    admin.save();
    return res.status(201).send({
      status: true,
      message: "service added successfully",
      data: obj,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, message: error.message });
  }
};

const  get_service = async function (req, res) {
  try {
    let data = req.query;
    let service = await serviceModel.find({});
   
    let { serviceName } = data;
    let result = [];
    let sr = 1;
    for (let i = 0; i < service.length; i++) {
      if (serviceName) {
        if (service[i].serviceName == serviceName) {
          result.push({
            SrNo: sr++,
            ServiceName: service[i].serviceName,
            Description: service[i].description,
            Image: service[i].serviceImage,
          });
          console.log(service[i].serviceImage)
          return res
            .status(200)
            .send({ status: true, message: "serviceList", data: result });
        }
      } else {
        result.push({
          SrNo: sr++,
          ServiceName: service[i].serviceName,
          Description: service[i].description,
          Image: service[i].serviceImage
        });
      }
    }
    if (result.length == 0) {
      return res.status(404).send({
        status: false,
        message: "no one service avalable for this service name",
      });
    }
    return res.status(200).send({
      message: "service list",
      list: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const update_service = async function (req, res) {
  try {
    let serviceId = req.params.id;
    let data = req.body;
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    if (!data) {
      return res.status(400).send({
        message: "please provide data for update service..!",
      });
    }
    let { serviceName, description, serviceImage } = data;
    let service = await serviceModel.findById(serviceId);

    if (serviceName != undefined) {
      if (!serviceName) {
        return res
          .status(400)
          .send({ status: false, message: "please provide serice Name" });
      }
      if (!nameRegex.test(serviceName)) {
        return res.status(400).send({
          status: false,
          message: "service name should contain alphabets only.",
        });
      }
      if (service.serviceName == serviceName) {
        return res.status(400).send({
          status: false,
          message: `${serviceName} is already exist please provide unique service name`,
        });
      }
    }

    if (description != undefined) {
      if (!description) {
        return res
          .status(400)
          .send({ status: false, message: "please provide description" });
      }
    }
    let obj = {
      serviceName: serviceName ? serviceName : service.serviceName,
      description: description ? description : service.description,
      serviceImage: serviceImage ? serviceImage : service.serviceImage,
    };
    if (req.files.length <= 1) {
      obj["serviceImage"] = baseUrl + '/uploads/' + req.files[i].filename
    }

    await serviceModel.findOneAndUpdate(
      { _id: serviceId },
      { $set: obj },
      { new: true }
    );
    return res.status(201).send({
      status: true,
      message: "service update successfully",
      data: obj,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const delete_service = async function (req, res) {
  try {
    let serviceId = req.params.id;
    let adminId = req.userId;

    let admin = await userModel.findById(adminId);
    let service = await serviceModel.findById(serviceId)
    if(!service){
      return res.status(400).send({
        message : 'service is not exsit..!'
      })
    }
    await serviceModel.deleteOne({ _id: serviceId });
    let index = 0;

    for (let adminId of admin["adminService"]) {
      if (adminId == serviceId) break;
      index++;
    }

    admin["adminService"].splice(index, 1);
    admin.save();
    return res
      .status(200)
      .send({ status: false, message: "service is deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { add_service, get_service, update_service, delete_service };
