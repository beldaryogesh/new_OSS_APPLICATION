const userModel = require("../models/userModel");
const otpGenerator = require("otp-generator");
const serviceModel = require("../../Admin/models/serviceModel");
const { add_service } = require('../../vendor/controller/vendorServiceController')
const Otp = require("../../Admin/models/otpModel");
const baseUrlUtils  = require('../../middlwares/baseURL')
const jwt = require("jsonwebtoken");
const {
  isValidRequestBody,
  isvalid,
  nameRegex,
  phoneRegex,
  emailRegex,
} = require("../../validations/validation");

const registerUser = async function (req, res) {
  try {
    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res.status(200).send({
        error_code: 400,
        message: "please provide  name, number, email, state , sity  for registation",
      });
    }

    let { name, number, email, state, city, address} = data;
    let obj = {};
   
    if (!isvalid(name)) {
      return res
        .status(200)
        .send({ error_code: 400, message: "please provide name" });
    }
    if (!nameRegex.test(name)) {
      return res.status(200).send({
        error_code: 400,
        message: "name should contain alphabets only.",
      });
    }
    obj["name"] = name;
    if (!isvalid(number))
      return res
        .status(200)
        .send({ error_code: 400, message: "Please enter the phone number." });
    if (!phoneRegex.test(number))
      return res.status(200).send({
        error_code: 400,
        message: "Enter the phone number in valid Indian format.",
      });
    let getnumber = await userModel.findOne({ number: number });
    if (getnumber) {
      return res.status(200).send({
        error_code: 400,
        message: "number is already in use, please enter a new one...!",
      });
    }
    obj["number"] = number;
    let getEmail = await userModel.findOne({ email: email });
    if (getEmail) {
      return res.status(200).send({
        error_code: 400,
        message: "email is already in use , please enter a new one",
      });
    }
    if (!email) {
      return res
        .status(200)
        .send({ error_code: 400, message: "please provide emailId" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(200)
        .send({ error_code: 400, message: "please provide valid emailID" });
    }
    obj["email"] = email;


    if (!state) {
      return res.status(200).send({ error_code: 400, message: 'please provide state name ..!' })
    }
    if (!nameRegex.test(state)) {
      return res.status(200).send({ error_code: 400, message: 'please provide valid state name..!' })
    }
    obj["state"] = state;
    if (!city) {
      return res.status(200).send({ error_code: 400, message: 'please provide city name ..!' })
    }
    if (!nameRegex.test(state)) {
      return res.status(200).send({ error_code: 400, message: 'please provide valid city name..!' })
    }

    obj["city"] = city;
    const otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let otp_new = await Otp.create({
      number: req.body.number,
      otp,
    });

    obj["otp"] = otp_new._id;
    let user = await userModel.create(obj);
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        organisation: "Appzia-Technology",
      },
      "one-stop-service"
    );
    {
      res.setHeader("x-api-key", token);
    }
    return res.status(201).send({
      error_code: 200,
      message: 'registration successfully',
      otp: otp,
      token: token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({error_code : 500, msg: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    const { number } = req.body;
    if (!isValidRequestBody(req.body)) {
      return res.status(200).send({
        error_code : 400,
        message: "please provide number for user login",
      });
    }

    let user = await userModel.findOne({ number });
    if (!user) {
      return res.status(200).send({
        error_code : 400,
        message: `no user registerd with ${number} number please register then you will be eligible to login`,
      });
    }
    const otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await Otp.findOneAndUpdate({ number }, { otp }, { new: true });
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        organisation: "Appzia-Technology",
      },
      "one-stop-service"
    );
    {
      res.setHeader("x-api-key", token);
    }
    {
      return res
        .status(201)
        .send({ error_code : 200, message :'otp send successfully', otp : otp, token: token });
    }
  } catch (error) {
    return res.status(500).send({ error_code : 500, message: error.message });
  }
};

const verifyOtp = async function (req, res) {
  try {
    let data = req.body;
    let userId = req.userId;
    if (!isValidRequestBody(data)) {
      return res
        .status(200)
        .send({error_code : 400, message: "please provide otp in body" });
    }

    const { otp } = data;
    if (!otp) {
      return res.status(200).send({
        error_code : 400,
        message: "please provide otp, opt filed is empty",
      });
    } 
    let user = await userModel.findById(userId);
    let number = user.number;
    const find_number_otp = await Otp.findOne({ number, otp });
    if (!find_number_otp) {
      return res.status(200).send({error_code : 404, message: "Invalid OTP" });
    }
    return res.status(200).send({ error_code : 200, message: "OTP verification successfully" });
  } catch (error) {
    return res.status(500).send({ error_code : 500, message: error.message });
  }
};


const loginWithGoogle = async function (req, res) {
  try {
    let Id = req.body.Id
    let check_Id = await userModel.findOne({ Id: Id })

    if (!check_Id) {
      let obj = {
        Id: req.body.Id,
        registerWith: 'Google'
      }
      let user = await userModel.create(obj)
      user.save()
      return res.status(200).send({error_code : 200, message: 'User got created..!'})
    }
    if (check_Id.number) {
      let token = jwt.sign(
        {
          userId: check_Id._id.toString(),
          organisation: "Appzia-Technology",
        },
        "one-stop-service"
      ); 
      {
        res.setHeader("x-api-key", token);
      }
      {
        return res
          .status(201)
          .send({ error_code : 200, message: 'login successfully..', token: token });
      }
    }else{
      return res.status(200).send({error_code : 200, message : 'user got created..!'})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error_code : 500,  message: 'error inside loginWithGoogle' })
  }
}

const loginWithFaceBook = async function (req, res) {
  try {
    let Id = req.body.Id
    let check_Id = await userModel.findOne({ Id: Id })

    if (!check_Id) {
      let obj = {
        Id: req.body.Id,
        registerWith: 'FaceBook'
      }
      let user = await userModel.create(obj)
      user.save()
      return res.status(200).send({error_code : 200, message: 'User got created..!'})
    }
    if (check_Id.number) {
      let token = jwt.sign(
        {
          userId: check_Id._id.toString(),
          organisation: "Appzia-Technology",
        },
        "one-stop-service"
      );
      {
        res.setHeader("x-api-key", token);
      }
      {
        return res
          .status(200)
          .send({ error_code : 200, message: 'login successfully..', token: token });
      }
    }else{
      return res.status(200).send({error_code : 200, message : 'user got created..!'})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error_code : 500, message: 'error inside loginWithFaceBook' })
  }
}

const registrationWithsocialMedia = async function (req, res) {
  try {
    let userId = req.body.Id;
    let data = req.body;
    let user = await userModel.findOne({Id : userId})
    if (!isValidRequestBody(data)) {
      return res.status(200).send({
        error_code: 400,
        message: "please provide  name, number, email, state , sity , userType for registation",
      });
    }

    let { name, number, email, state, city } = data;
    if (!isvalid(name)) {
      return res
        .status(200)
        .send({ error_code: 400, message: "please provide name" });
    }
    if (!nameRegex.test(name)) {
      return res.status(200).send({
        error_code: 400,
        message: "name should contain alphabets only.",
      });
    }
   
    if (!isvalid(number))
      return res
        .status(200)
        .send({ error_code: 400, message: "Please enter the phone number." });
    if (!phoneRegex.test(number))
      return res.status(200).send({
        error_code: 400,
        message: "Enter the phone number in valid Indian format.",
      });
    let getnumber = await userModel.findOne({ number: number });
    if (getnumber) {
      return res.status(200).send({
        error_code: 400,
        message: "number is already in use, please enter a new one...!",
      });
    }
   
    let getEmail = await userModel.findOne({ email: email });
    if (getEmail) {
      return res.status(200).send({
        error_code: 400,
        message: "email is already in use , please enter a new one",
      });
    }
    if (!email) {
      return res
        .status(200)
        .send({ error_code: 400, message: "please provide emailId" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(200)
        .send({ error_code: 400, message: "please provide valid emailID" });
    }

    if (!state) {
      return res.status(200).send({ error_code: 400, message: 'please provide state name ..!' })
    }
    if (!nameRegex.test(state)) {
      return res.status(200).send({ error_code: 400, message: 'please provide valid state name..!' })
    }
  
    if (!city) {
      return res.status(200).send({ error_code: 400, message: 'please provide city name ..!' })
    }
    if (!nameRegex.test(state)) {
      return res.status(200).send({ error_code: 400, message: 'please provide valid city name..!' })
    }

    let obj = {
      name: req.body.name ? req.body.name : undefined,
      number: req.body.number ? req.body.number : undefined,
      email: req.body.email ? req.body.email : undefined,
      state: req.body.state ? req.body.state : undefined,
      city: req.body.city ? req.body.city : undefined,
      address: req.body.address ? req.body.address : undefined,
    }
    
    const otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let otp_new = await Otp.create({
      number: req.body.number,
      otp,
    });

    obj["otp"] = otp_new._id;
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        organisation: "Appzia-Technology",
      },
      "one-stop-service"
    );
    {
      res.setHeader("x-api-key", token);
    }
   let update = await userModel.findOneAndUpdate({ Id: userId }, { $set: obj }, { new: true });
   update.save()
   return res.status(201).send({error_code : 200, message: 'otp send succssfully', otp : otp , token : token})

  } catch (error) {
    console.log(error);
    return res.status(500).send({error_code : 500, message: 'error inside registrationWithGoogle ' })
  }
}

const sellerRegistration_1 = async function(req, res){
  try{
    let userId = req.userId;
    let service = await serviceModel.find()
    let user = await userModel.findById(userId)  
    let {storeName, storeImage, typeOfService} = req.body;
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    let obj = {}
    if(!typeOfService){
      return res.status(200).send({error_code : 400, message : 'please provide type of service..!'})
    }
    let ser = [];
    let flag = 0;
    for (let i = 0; i < service.length; i++) {
      if (service[i].serviceName == typeOfService) {
        flag++;
      }
      ser.push(service[i].serviceName);
    }
    if (flag != 1) {
      return res.status(200).send({
        error_code: 400,
        message: `service type should be ${ser} `,
      });
    }
    obj['typeOfService'] = typeOfService;
    if(!storeName){
      return res.status(200).send({error_code : 400, message : 'please provide store Name..!'})
    }
    if(!nameRegex.test(storeName)){
      return res.status(200).send({error_code : 400, message : 'please provide valid store name..!'})
    }
    obj['storeName'] = storeName;
    if(req.files.length == 0){
      return res.status(200).send({error_code : 400, message : 'please provide store images..!'})
    }

    if(req.files.length > 0){
      for (let i = 0; i < req.files.length; i++) {
     const imageUrl = baseUrl + '/uploads/' +  req.files[i].filename;
       user.storeImages.push(imageUrl);
      }
     user.save()
    }
let a =   await userModel.findByIdAndUpdate({_id : userId}, {$set: obj}, {new : true})
 console.log(a)
   return res.status(200).send({error_code : 200, message : 'next'})
  }catch(error){
    console.log(error);
    return res.status(500).send({error_code : 500, message : 'error inside seller registration_1..!'})
  }
}

const sellerRegistration_2 = async function(req, res){
  try{
    let userId = req.userId;
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    let obj = {}
    
    for (let i = 0; i < req.files.length; i++) {
      if (req.files[i].fieldname == "aadharCard") {
        obj["aadharCard"] = baseUrl + '/uploads/' +  req.files[i].filename;
      } else if (req.files[i].fieldname == "panCard") {
        obj["panCard"] = baseUrl + '/uploads/' +  req.files[i].filename;
      }
    }
    if(req.files.length != 2){
      return res.status(200).send({error_code : 400, message : 'please provide both document..!'})
    }
    await userModel.findByIdAndUpdate({_id : userId}, {$set: obj}, {new : true})
    await add_service(req, res)

 return res.status(200).send({error_code : 200, message : 'next'})
  }catch(error){
    console.log(error);
    return res.status(500).send({error_code : 500, message : 'error inside seller registration_2..!'})
  }
}

const addAddress = async function(req, res){
  try{
    let userId = req.userId;
    let address = req.body.address;
    let user = await userModel.findById(userId)
    let obj = {}
    if(!user){
      return res.status(200).send({error_code : 404, message : 'user not found..!'})
    }
    if(!address){
      return res.status(200).send({error_code : 400, message : 'please provide address..!'})
    }
    obj['address'] = address
   await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: obj },
      { new: true }
    );
    return res.status(200).send({ error_code : 200, message: "next" });
  }catch(error){
    console.log(error);
    return res.status(500).send({error_code : 500, messsage : 'error inside add address api..!'})
  }
}


module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  loginWithGoogle,
  loginWithFaceBook,
  registrationWithsocialMedia,
  sellerRegistration_1,
  sellerRegistration_2,
  addAddress
};


