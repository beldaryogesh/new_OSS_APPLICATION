const vendorServiceModel = require("../models/vendorServiceModel");
const serviceModel = require("../../Admin/models/serviceModel");
const userModel = require("../../User/models/userModel");
const baseUrlUtils = require('../../middlwares/baseURL')

const mongoose = require("mongoose");

const { nameRegex, phoneRegex } = require("../../validations/validation");

const add_service = async (req, res) => {
  try {
    let vendor = await userModel.findById(req.userId);
    let obj = {
      vendorId : vendor._id,
      storeName: vendor.storeName,
      number: vendor.number,
      typeOfService: vendor.typeOfService,
      state: vendor.state ? vendor.state : undefined,
      city: vendor.city ? vendor.city : undefined,
      address: vendor.address ? vendor.address : undefined,
      storeImages : vendor.storeImages ? vendor.storeImages : undefined
    };
    const service = await vendorServiceModel.create(obj);
    let find_service = await serviceModel.findOne({serviceName: vendor.typeOfService});
    vendor.vendorServices.push(service._id);
    find_service.vendorId.push(vendor._id);
    find_service.serviceId.push(service._id);
     await vendor.save();
     await find_service.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error_code : 500, message: 'error inside add service ..!'
    });
  }
};

const getService = async function (req, res) {
  try {
    let serviceName = req.body.serviceName;
    if (!serviceName) {
      return res.status(200).send({
        error_code : 400, message: "please provide service name..!",
      });
    }
    let service = await vendorServiceModel.find({typeOfService : serviceName});
   if(service.length == 0){
    return res.status(200).send({error_code : 404, message : 'no service available for this category..!'})
   }
  
    let result = [];
    for (let i = 0; i < service.length; i++) {
      
       result.push({
        storeName: service[i].storeName,
        storeImages : service[i].storeImages,
        Address: service[i].address,
        serviceId : service[i]._id,
        profileImage : service[i].profileImage ? service[i].profileImage : undefined
      });
    }

    return res.status(200).send({
      error_code : 200, message: "service List",
      data: result, 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error_code : 500, message: 'error inside get service..!',
    });
  }
};


const getVendorServiceById = async function(req, res){
  try{
    let serviceId = req.body.serviceId;
    if(!serviceId) {
      return res.status(200).send({error_code : 400, message : 'please provide service Id..!'})
    }
   
      if (!mongoose.isValidObjectId(serviceId)) {
        return res.status(200).send({
          error_code: 400,
          message: "please provide valid mongoose Id..!",
        });
      }
    
    let service = await vendorServiceModel.findById(serviceId)
    if(!service){
      return res.status(200).send({error_code : 404, message : 'no service available for this service Id..!'})
    }
    let obj = {
      storeName: service.storeName,
      Mobile: service.number,
      storeImages: service.storeImages,
      Address: service.address,
      profileImage : service.profileImage ? service.profileImage : undefined
    }
    return res.status(200).send({error_code : 200, data : obj})
  }catch(error){
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside getVendorServiceById..!'})
  }
}

const update_service = async function (req, res) {
  try {
    let vendorId = req.userId
    if (!req.body) {
      return res
        .status(200)
        .send({ error_code : 400, message: "please provide data for update service..!" });
    }
     let baseUrl = baseUrlUtils.generateBaseUrl(req);
    let { storeName, number, street, city, pincode } = req.body;
    let service = await vendorServiceModel.findById(vendorId);
    if (storeName) {
      if (!nameRegex.test(storeName)) {
        return res.status(200).send({
          error_code : 400, message: "please provide valid storeName..!",
        });
      }
    }
    if (number) {
      if (!number) {
        return res.status(200).send({ error_code : 400, message: "please provide number..!" });
      }
      if (!phoneRegex.test(number)) {
        return res.status(200).send({
          error_code : 400, message: "please provide valid indian formate number..!",
        });
      }
    }

    let obj = {
      storeName: storeName ? storeName : service.storeName,
      number: number ? number : service.number,
    };
    if(street){
      obj['street'] = street
    }
    if(city){
      obj['city'] = city
    }  

    if (req.files.length>0) {
      obj["storeImages"] =baseUrl + '/uploads/' +  req.files[0].filename;
    }

  await vendorServiceModel.findOneAndUpdate(
      { vendorId : vendorId },
      { $set: obj },
      { new: true }
    );
   
    return res.status(201).send({
      error_code : 200, message: "store details update successfully..!",
      details: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error_code : 500, message: "Error updating vendor service..!",
    });
  }
};

const totale_stores = async function (req, res) {
  try {
    let count_stores = await vendorServiceModel.find({});
    if (count_stores.length == 0) {
      return res.status(200).send({
        error_code : 404, message: "no store available..!",
      });
    }
    return res.status(200).send({
      error_code: 200,
      total_store: count_stores.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({error_code : 500, message : 'error inside totale stores..!'})
  }
};

const totalCustomer = async function (req, res){
  try{
    let user = await userModel.find({})
    let result = []
    for(let i=0; i<user.length; i++){
      if(user[i].userType == 'customer'){
        result.push(user[i])
      }
    }
    return res.status(200).send({error_code : 200,total_customer : result.length})
  }catch(error){
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside total customer'})
  }
}

const customer = async function(req, res){
  try{
    let vendorId = req.userId;

    let customer = await vendorServiceModel.findOne({ vendorId : vendorId })
     if(!customer){
      return res.status(200).json({error_code : 404, customer : 0})
     }
    return res.status(200).send({error_code : 200, customer : customer.customer.length})

  }catch(error){
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside customer api..!'})
  }
}

const getMostUseServices = async function (req, res) {
  try {
    const service = await serviceModel.find().sort({ usageCount: -1 }).limit(10);
    let obj = []
   for(let i=0; i<service.length; i++){
    obj.push({
      serviceName:service[i].serviceName,
      serviceImage:service[i].serviceImage,
      serviceId:service[i]._id

    })
   }
    
    return res.status(200).send({
      error_code : 200, message: "most used service",
      services: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error_code : 500, message: 'error inside get most service api..!' });
  }
};

const contactViews = async function (req, res) {
  try {
    let vendorId = req.userId;
    let getviews = await vendorServiceModel.find({ vendorId: vendorId });
    let contact = 0;

    for (let i = 0; i < getviews.length; i++) {
      if (getviews[i].serviceViewdUser) {
        contact = getviews[i].serviceViewdUser.length;
      }
    }
    return res.status(200).send({
      error_code : 200,
      contactViews: contact,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error_code : 500, message: error,
    });
  }
};

const getServiceName = async function(req, res){
  try{
    let service = await serviceModel.find()
    let ser = [];
    for (let i = 0; i < service.length; i++) {
      ser.push(service[i].serviceName);
    }
    return res.status(200).send({error_code : 200, service : ser})

  }catch(error){
    console.log(error);
    return res.status(500).send({error_code : 500, message : 'error inside get service name.!'})
  }
}

module.exports = {
  add_service,
  getService,
  update_service,
  totale_stores,
  getMostUseServices,
  contactViews,
  totalCustomer,
  customer,
  getVendorServiceById,
  getServiceName
};
