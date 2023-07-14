const vendorServiceModel = require("../models/vendorServiceModel");
const serviceModel = require("../../Admin/models/serviceModel");
const pinValidator = require("pincode-validator");

const { nameRegex, phoneRegex } = require("../../validations/validation");

const addService = async function (req, res) {
  try {
    let data = req.body;

    if (!data) {
      return res.status(400).send({
        message: "please provide data for add service..!",
      });
    }
    let { categoryName, serviceName, number, serviceAddress } = data;

    let service = await serviceModel.find({});
    let obj = {};
    obj["vendorId"] = req.userId;
    if (!categoryName) {
      return res.status(400).send({
        message: "please provide category name..!",
      });
    }
    if (!nameRegex.test(categoryName)) {
      return res.status(400).send({
        message: "service name should contain alphabets only.",
      });
    }
    obj["categoryName"] = categoryName;
    let ser = [];
    let flag = 0;
    for (let i = 0; i < service.length; i++) {
      if (service[i].serviceName == categoryName) {
        flag++;
      }
      ser.push(service[i].serviceName);
    }
    if (flag != 1) {
      return res.status(400).send({
        message: `category should be ${ser} `,
      });
    }
    if (!serviceName) {
      return res.status(400).send({
        message: "please provide serviceName..!",
      });
    }
    if (!nameRegex.test(serviceName)) {
      return res.status(400).send({
        message: `${serviceName} not valid service name, service name should be contain alphabets only..!`,
      });
    }
    obj["serviceName"] = serviceName;
    if (!number) {
      return res.status(400).send({
        message: "please provide number..!",
      });
    }
    if (!phoneRegex.test(number)) {
      return res.status(400).send({
        message: `${number} not valid mobile number, please provide valid indian formate mobile number`,
      });
    }
    obj["number"] = number;
    if (!serviceAddress) {
      return res.status(400).send({
        message: "please provide serviceAddress..!",
      });
    }
    if (
      !serviceAddress.street ||
      !serviceAddress.city ||
      !serviceAddress.pincode
    )
      return res.status(400).send({
        status: false,
        message: "Enter the street, city and pincode in the serviceAddress.",
      });
    let pinValidated = pinValidator.validate(serviceAddress.pincode);
    if (!pinValidated)
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid pincode." });
    obj["serviceAddress"] = serviceAddress;
    if (!req.file) {
      return res.status(400).send({
        message: "please provide image..!",
      });
    }
    const { filename, path } = req.file;

    obj["image"] = {
      fileName: filename,
      fileAddress: path,
    };

    const Service = await vendorServiceModel.create(obj);
    const cate = await serviceModel.findOne({ serviceName: categoryName });
    cate.serviceId.push(Service._id);

    cate.save();
    console.log(cate);
    return res.status(201).send({
      message: "service added successfully..!",
      data: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
};

const getService = async function (req, res) {
  try {
    let serviceName = req.query.serviceName;
    if(!serviceName){
      return res.status(400).send({
        message : 'please provide service name..!'
      })
    }
    let service = await serviceModel.findOne({ serviceName: serviceName });
    if(!service){
      return res.status(400).send({
        message : 'no service available for this service name..!'
      })
    }
    let vendor_service = await vendorServiceModel.find({
      _id: service.serviceId,
    });
    if(!vendor_service){
      return res.status(400).send({
        message : 'no service available..!'
      })
    }
    let sr = 1;
    let result = [];
    for (let i = 0; i < vendor_service.length; i++) {
        result.push({
          serialNumber: sr++,
          serviceName: vendor_service[i].serviceName,
          Mobile: vendor_service[i].number,
          image: vendor_service[i].image,
          Address: vendor_service[i].serviceAddress,
        })
    }
   return res.status(200).send({
    message : 'service List',
    data : result
   })

  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = {
  addService,
  getService,
};
