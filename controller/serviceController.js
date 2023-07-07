const serviceModel = require("../models/serviceModel");
const userModel = require("../models/userModel");

const { isvalid, nameRegex } = require("../validations/validation");

const add_service = async function (req, res) {
  try {
    let data = req.body;
    let adminId = req.userId;
    if (!data) {
      return res.status(400).send({
        status: false,
        message: "please provide a data for add services",
      });
    }
    let { serviceName, description } = data;
    let admin = await userModel.findById(adminId);
    let obj = {};
    if (!isvalid(serviceName)) {
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
    obj["serviceName"] = serviceName;
    if (!isvalid(description)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide description" });
    }
    obj["description"] = description;
    if (req.file) {
      const { filename, path } = req.file;
      obj["image"] = {
        fileName: filename,
        fileAddress: path,
      };
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
    return res.status(500).send({ status: false, message: error.message });
  }
};

const get_service = async function (req, res) {
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
            Image: service[i].image,
          });
          return res
            .status(200)
            .send({ status: true, message: "serviceList", data: result });
        }
      } else {
        result.push({
          SrNo: sr++,
          ServiceName: service[i].serviceName,
          Description: service[i].description,
          Image: service[i].image,
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
    if (!data) {
      return res.status(400).send({
        message: "please provide data for update service..!",
      });
    }
    let { serviceName, description, image } = data;
    let service = await serviceModel.findById(serviceId);

    if (serviceName != undefined) {
      if (!isvalid(serviceName)) {
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
      if (!isvalid(description)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide description" });
      }
    }
    let obj = {
      serviceName: serviceName ? serviceName : service.serviceName,
      description: description ? description : service.description,
      image: image ? image : service.image,
    };
    if (req.file) {
      const { filename, path } = req.file;
      obj["image"] = {
        fileName: filename,
        fileAddress: path,
      };
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
