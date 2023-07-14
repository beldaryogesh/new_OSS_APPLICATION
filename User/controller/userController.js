const userModel = require("../models/userModel");
const serviceModel = require('../../Admin/models/serviceModel');
const pinValidator = require("pincode-validator");
const bcrypt = require("bcrypt");
const {
  isValidRequestBody,
  isvalid,
  nameRegex,
  phoneRegex,
  emailRegex,
  passRegex,
} = require("../../validations/validation");

const get_customer_list = async function (req, res) {
  try {
    let user = await userModel.find({});
    let sr = 1;
    let result = [];
    for (let i = 0; i < user.length; i++) {
      console.log(user[i]);
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
      return res.status(404).send({
        message: "no customer is exist..!",
      });
    }
    return res.status(200).send({
      status: true,
      totalCusomer: result.length,
      message: "userList",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const delete_user_by_admin = async function (req, res) {
  try {
    let userId = req.params.id;
    let user = await userModel.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(400).send({
        message: "user is not exist..!",
      });
    }
    await userModel.deleteOne({ _id: userId });
    return res
      .status(200)
      .send({ status: true, message: "user Deleted Successfully..!" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const get_vendor_list = async function (req, res) {
  try {
    let user = await userModel.find({});
    let sr = 1;
    let result = [];
    for (let i = 0; i < user.length; i++) {
      console.log(user[i]);
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
      return res.status(404).send({
        message: "no vendor is exist..!",
      });
    }
    return res.status(200).send({
      status: true,
      totalVendor: result.length,
      message: "vendor list",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


const update_user = async function (req, res) {
  try {
    let userId = req.userId;
    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide data for update" });
    }
    const { name, number, email, password, address, typeOfService, storeName } = data;

    let user = await userModel.findById(userId);
    let service = await serviceModel.find({ });
    if(!user){
      return res.status(404).send({
        message : 'user is not found..!'
      })
    }
    let obj = {};
    if (name != undefined) {
      if (!isvalid(name)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide name" });
      }
      if (!nameRegex.test(name))
        return res.status(400).send({
          status: false,
          message: "name should contain alphabets only.",
        });
      if (user.name == name) {
        return res.status(400).send({
          status: false,
          message: `${name} is already exist please use new name`,
        });
      }

      obj["name"] = name;
    }

    if (number != undefined) {
      if (!isvalid(number)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide number" });
      }
      if (!phoneRegex.test(number))
        return res.status(400).send({
          status: false,
          message: "please provide valid indian format number",
        });
      if (user.number == number) {
        return res.status(400).send({
          status: false,
          message: `${number} is alrady use please provide unique number`,
        });
      }
      obj["number"] = number;
    }
    if (email != undefined) {
      if (!isvalid(email)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide email" });
      }
      if (!emailRegex.test(email))
        return res.status(400).send({
          status: false,
          message: "please provide valid indian format email",
        });
      if (user.email == email) {
        return res.status(400).send({
          status: false,
          message: `${email} is already in use please provide unique email`,
        });
      }
      obj["email"] = email;
    }

    if (password != undefined) {
      if (!isvalid(password)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide password" });
      }
      if (!passRegex.test(password))
        return res.status(400).send({
          status: false,
          message:
            "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character..!",
        });
      if (user.password == password) {
        return res.status(400).send({
          status: false,
          message: `${password} is already in use please provide unique password`,
        });
      }

      const passwordData = await userModel.findOne({ password: password });
      if (passwordData)
        return res
          .status(400)
          .send({ status: false, msg: `${password} is already present` });
      const saltRounds = 8;
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      obj["password"] = encryptedPassword;
    }
    if (address) {
      if (
        !isvalid(address.street) ||
        !isvalid(address.city) ||
        !isvalid(address.pincode)
      )
        return res.status(400).send({
          status: false,
          message: "Enter the street, city and pincode in the address.",
        });
      let pinValidated = pinValidator.validate(data.address.pincode);
      if (!pinValidated)
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid pincode." });
    }
    obj["address"] = address;
    if (req.file) {
      const { filename, path } = req.file;
      obj["profileImage"] = {
        fileName: filename,
        fileAddress: path,
      };
    }

    if(user.userType == 'vendor'){
      if(typeOfService){
        if(!typeOfService){
          return res.status(400).send({
            message : 'please provide type of service..!'
          })
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
          return res.status(400).send({
            message: `service type should be ${ser} `,
          });
        }
       obj['typeOfService'] = typeOfService;
      }
      
      if(storeName){
        if(!storeName){
          return res.status(400).send({
            message : 'please provide store name..!'
          })
        }
        obj['storeName'] = storeName;
      }
      for(let i=0; i<req.files.length; i++){
        if(req.files[i].fieldname == 'aadharCard'){
          obj['aadharCard'] = {
            fileName : req.files[i].filename,
            fileAddress : req.files[i].path
          }
        }else if(req.files[i].fieldname == 'panCardFrontPage'){
          obj['panCardFrontPage'] = {
            fileName : req.files[i].filename,
            fileAddress : req.files[i].path
          }
        }else if(req.files[i].fieldname == 'panCardBackPage'){
          obj['panCardBackPage'] = {
            fileName : req.files[i].filename,
            fileAddress : req.files[i].path
          }
        }else if(req.files[i].fieldname == 'storeImage'){
          obj['storeImage'] = {
            fileName : req.files[i].filename,
            fileAddress : req.files[i].path
          }
        }
      }
    }
    let update = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: obj },
      { new: true }
    );
    res.status(201).send({ status: true, message: "success", data: update });
  
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, message: error.message });
  }
};

const delete_user = async function (req, res) {
  try {
    let userId = req.userId;
    let user = await userModel.findById(userId);
    if(!user){
      return res.status(400).send({
        message : 'user is not exist..!'
      })
    }
    await userModel.deleteOne({ _id: userId });

    return res.status(200).send({
      message: "user deleted successfully..!",
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};


module.exports = {
  get_customer_list,
  delete_user_by_admin,
  get_vendor_list,
  update_user,
  delete_user,
};
