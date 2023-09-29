const userModel = require("../models/userModel");
const serviceModel = require('../../Admin/models/serviceModel');
const baseUrlUtils = require('../../middlwares/baseURL')
const faqModel = require('../../Admin/models/faqModel')
const vendorServiceModel = require('../../vendor/models/vendorServiceModel')
const cities = require('country-state-city')

const {
  isValidRequestBody,
  nameRegex,
  phoneRegex,
  emailRegex,
} = require("../../validations/validation");

const get_customer_list = async function (req, res) {
  try {
    let user = await userModel.find({});
    let sr = 1;
    let result = [];
    for (let i = 0; i < user.length; i++) {
      
      if (user[i].userType == "customer") {
        result.push({
          serialNumber: sr++,
          ClientName: user[i].name,
          Mobile: user[i].number,
          Email: user[i].email,
          Address: user[i].address,
        });
      }
    }
    if (result.length == 0) {
      return res.status(200).send({
        error_code : 404,
        message: "no customer is exist..!",
      });
    }
    return res.status(200).send({
      error_code : 200,
      totalCusomer: result.length,
      message: "userList",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({error_code : 500, message: error.message });
  }
};

const delete_user_by_admin = async function (req, res) {
  try {
    let userId = req.params.id;
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(200).send({
        error_code : 400,
        message: "user is not exist..!",
      });
    }
    await userModel.deleteOne({ _id: userId });
    return res
      .status(200)
      .send({ error_code : 200, message: "user Deleted Successfully..!" });
  } catch (error) {
    return res.status(500).send({error_code : 500, message: error.message });
  }
};

const get_vendor_list = async function (req, res) {
  try {
    let user = await userModel.find({});
    let sr = 1;
    let result = [];
    for (let i = 0; i < user.length; i++) {
      if (user[i].userType == "vendor") {
        result.push({
          serialNumber: sr++,
          ClientName: user[i].name,
          Mobile: user[i].number,
          Email: user[i].email,
          Address: user[i].address,
          ProfilePicture : user[i].image
        });
      }
    }
    if (result.length == 0) {
      return res.status(200).send({
        error_code : 404,
        message: "no vendor is exist..!",
      });
    }
    return res.status(200).send({
      error_code : 200,
      totalVendor: result.length,
      message: "vendor list",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ error_code : 500, message: error.message });
  }
};

const update_user = async function (req, res) {
  try {
    let userId = req.userId;
    let data = req.body;
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    const { name, state, city, address } = data;

    let user = await userModel.findById(userId);
    if(!user){
      return res.status(200).send({
        error_code : 404,
        message : 'user is not found..!'
      })
    }
    let obj = {};
    if (name != undefined) {
      if (!name) {
        return res
          .status(200)
          .send({ error_code : 400, msg: "please provide name" });
      }
      if (!nameRegex.test(name))
        return res.status(200).send({
          error_code : 400,
          message: "name should contain alphabets only.",
        });
      obj["name"] = name;
    }

      if(state){
        if(!state){
          return res.status(200).send({error_code : 400, message : 'please provide state name..!'})
        }
        if(!nameRegex.test(state)){
          return res.status(200).send({error_code : 400, message : 'please provide valid state name'})
        }
        obj["state"] = state;
      }
      if(city){
        if(!city){
          return res.status(200).send({error_code : 400, message : 'please provide city name..!'})
        }
        if(!nameRegex.test(state)){
          return res.status(200).send({error_code : 400, message : 'please provide valid state name'})
        }
        obj["city"] = city;
      }
     
      if (req.files.length>0) {
        obj["profileImage"] = baseUrl + '/uploads/' +  req.files[0].filename;
      }
      if(address){
        if(!address){
          return res.status(200).send({error_code : 400, message : 'please provide address..!'})
        }
        obj["address"] = address;
      }       
   await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: obj },
      { new: true }
    );
    res.status(201).send({ error_code : 200, message: "User Update Successfully..!" , data : obj });
  
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error_code : 400, message: error.message });
  }
};

const update_vendor = async function (req, res) {
  try {
    let userId = req.userId;
    console.log(userId)
    let data = req.body;
    let service = await vendorServiceModel.findOne({vendorId : userId})
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    if (!isValidRequestBody(data)) {
      return res
        .status(200)
        .send({ error_code : 400, message: "please provide data for update" });
    }
    const { name, address, profileImage } = data;

    let user = await userModel.findById(userId);
    if(!user){
      return res.status(200).send({
        error_code : 404,
        message : 'user is not found..!'
      })
    }
    let obj = {};
    if (name != undefined) {
      if (!name) {
        return res
          .status(200)
          .send({ error_code : 400, msg: "please provide name" });
      }
      if (!nameRegex.test(name))
        return res.status(200).send({
          error_code : 400,
          message: "name should contain alphabets only.",
        });
      obj["name"] = name;
    }
      
    if (req.files.length>0) {
      obj["profileImage"] =baseUrl + '/uploads/' +  req.files[0].filename;
    }
    if(address){
      if(!address){
        return res.status(200).send({error_code : 400, message : 'please provide address..!'})
      }
      obj["address"] = address;
    }
    await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: obj },
      { new: true }
    );
    console.log(obj)
    if(obj.profileImage){
      service.profileImage = obj.profileImage
    }
    if(obj.address){
      service.address = obj.address
    }
    service.save()
    res.status(200).send({ error_code : 200, message: "User Update Successfully..!" , data : obj });
  
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error_code : 400, message: error.message });
  }
};

const delete_user = async function (req, res) {
  try {
    let userId = req.userId;
    let user = await userModel.findById(userId);
    if(!user){
      return res.status(200).send({
        error_code : 400,
        message : 'user is not exist..!'
      })
    }
   await userModel.deleteOne({ _id: userId });

    return res.status(200).send({
      error_code : 200,
      message: "user deleted successfully..!",
    });
  } catch (error) {
    return res.status(500).send({error_code : 500, message: error });
  }
};

const stateList = async function(req, res){
  try {
    let states = cities.State.getStatesOfCountry('IN')
    let result = []
    for(let i= 0; i<states.length; i++){
      result.push(states[i].name)
    }
    return res.status(200).send({error_code : 200, states : result})
   
  } catch (error) {
    console.log(error);
    return res.status(500).send({error_code : 500, message : 'error insode state list..!'})
  }
}

const cityList = async function(req, res){
  try{
  const stateName = req.query.state;

  let state = cities.State.getStatesOfCountry('IN')
  let code = ''
  for(let i=0; i<state.length; i++){
    if(state[i].name == stateName){
      code += state[i].isoCode
    }
  }
  let result = [];
  let city = cities.City.getCitiesOfState('IN', code);
 
  for(let i=0; i<city.length; i++){
   result.push(city[i].name)
  }
  return res.status(200).send({error_code : 200, city : result})
  }catch(error){
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside state list..!'})
  }
}

const  get_admin_service = async function (req, res) {
  try {
    let service = await serviceModel.find({});
 
    let result = [];
    for (let i = 0; i < service.length; i++) {
        result.push({
          ServiceName: service[i].serviceName,
          serviceImage: service[i].serviceImage,
          serviceId : service[i]._id
        });
    }

    return res.status(200).send({
      error_code : 200,
      message: "service list",
      list: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUserById = async function(req, res){
  try{
    let userId = req.userId;
    let user = await userModel.findById(userId)
    if(!user){
      return res.status(200).send({message : 'user is not exist..!'})
    }
   
    let obj = {
      image : user.profileImage ? user.profileImage : undefined,
      name : user.name ? user.name : undefined,
      number : user.number ? user.number : undefined,
      email : user.email ? user.email : undefined,
      state : user.state ? user.state : undefined,
      city : user.city ? user.city : undefined,
      address : user.address ? user.address : undefined
    }
    return res.status(200).send({error_code : 200, user : obj})

  }catch(error){
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside getUserById'})
  }
}

const get_costomer_faq = async function (req, res) {
  try { 
    let faq = await faqModel.find({});
    let faqs = [];
    for (let i = 0; i < faq.length; i++) {
      if (faq[i].userType == "customer") {
        faqs.push({
          question: faq[i].question,
          reply : faq[i].reply,
        });
      }
    } 
    if (faqs.length == 0) {
      return res.status(200).send({
        error_code : 200,
        message: "no customer faqs exist..!",
      });
    }
    return res.status(200).send({error_code : 200,faqs});
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error_code : 500,
      message: error,
    });
  }
};

module.exports = {
  get_customer_list,
  delete_user_by_admin,
  get_vendor_list,
  update_user,
  update_vendor,
  delete_user,
  stateList,
  cityList,
  getUserById,
  get_admin_service,
  get_costomer_faq
};
