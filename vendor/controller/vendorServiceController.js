const vendorServiceModel = require("../models/vendorServiceModel");
const serviceModel = require("../../Admin/models/serviceModel");
const userModel = require("../../User/models/userModel");
const pinValidator = require("pincode-validator");
const { nameRegex, phoneRegex } = require("../../validations/validation");

const add_service = async function (req, res) {
  try {
    let vendorId = req.userId;
    let vendor = await userModel.findById(vendorId);
    let service = await vendorServiceModel.find({ vendorId: vendorId });

    if (service) {
      return res.status(200).send({
        message: "you are already peovide service..!",
      });
    }
    let obj = {
      vendorId: vendorId,
      storeName: vendor.storeName,
      number: vendor.number,
      typeOfService: vendor.typeOfService,
      serviceAddress: vendor.address,
    };

    const Service = await vendorServiceModel.create(obj);
    let find_service = await serviceModel.findOne({
      serviceName: vendor.typeOfService,
    });
    vendor.vendorServices.push(Service._id);
    find_service.vendorId.push(vendorId);
    find_service.serviceId.push(Service._id);
    vendor.save();
    find_service.save();
    return res.status(201).send({
      message: "store details added successfully..!",
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
    if (!serviceName) {
      return res.status(400).send({
        message: "please provide service name..!",
      });
    }
    let service = await serviceModel.findOne({ serviceName: serviceName });
    if (service.serviceId.length == 0) {
      return res.status(400).send({
        message: "no service available for this service name..!",
      });
    }
    let vendor_service = await vendorServiceModel.find({
      _id: service.serviceId,
    });
    if (!vendor_service) {
      return res.status(400).send({
        message: "no service available..!",
      });
    }
    let sr = 1;
    let result = [];
    for (let i = 0; i < vendor_service.length; i++) {
      result.push({
        serialNumber: sr++,
        storeName: vendor_service[i].storeName,
        Mobile: vendor_service[i].number,
        image: vendor_service[i].image,
        Address: vendor_service[i].serviceAddress,
      });
    }
    return res.status(200).send({
      message: "service List",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const update_service = async function (req, res) {
  try {
    let serviceId = req.params.id;
    // let data = req.body;

    if (!req.body) {
      return res
        .status(400)
        .send({ message: "please provide data for update daitels..!" });
    }
    let { storeName, number, serviceAddress } = req.body;
    let service = await vendorServiceModel.findById(serviceId);
    if (storeName) {
      if (!nameRegex.test(storeName)) {
        return res.status(400).send({
          message: "please provide valid storeName..!",
        });
      }
    }
    if (number) {
      if (!number) {
        return res.status(400).send({ message: "please provide number..!" });
      }
      if (!phoneRegex.test(number)) {
        return res.status(400).send({
          message: "please provide valid indian formate number..!",
        });
      }
    }
    if (serviceAddress) {
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
    }
    let obj = {
      storeName: storeName ? storeName : service.storeName,
      number: number ? number : service.number,
      serviceAddress: serviceAddress ? serviceAddress : service.serviceAddress,
    };

    if (req.files) {
      obj["storeImages"] = {
        fileName: req.files[0].filename,
        fileAddress: req.files[0].path,
      };
    }
    await vendorServiceModel.findByIdAndUpdate(
      { _id: serviceId },
      { $set: obj },
      { new: true }
    );
    return res.status(202).send({
      message: "store details update successfully..!",
      details: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error updating vendor service..!",
    });
  }
};

const totale_stores = async function (req, res) {
  try {
    let count_stores = await vendorServiceModel.find({});
    if (count_stores.length == 0) {
      return res.status(404).send({
        message: "no store available..!",
      });
    }
    return res.status(200).send({
      total_store: count_stores.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getMostUseServices = async function (req, res) {
  try {
    const service = await serviceModel.find().sort({ usageCount: -1 }).limit(5);
    console.log(service);
    return res.status(200).send({
      message: "most used service",
      services: service,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const contactViews = async function (req, res) {
  try {
    let vendorId = req.userId;
    let getviews = await vendorServiceModel.find({ vendorId: vendorId });
    let contact = 0;

    for (let i = 0; i < getviews.length; i++) {
      if (getviews[i].serviceViewdUser){
        contact = getviews[i].serviceViewdUser.length;
      }
    }
    return res.status(200).send({
      contactViews: contact
    });
  } catch (error) {
    console.log(error); 
    return res.status(500).send({
      message: error
    });
  }
};

module.exports = {
  add_service,
  getService,
  update_service,
  totale_stores,
  getMostUseServices,
  contactViews
};




