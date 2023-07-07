const userModel = require("../models/userModel");
const pinValidator = require("pincode-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  isvalid,
  passRegex,
  nameRegex,
  phoneRegex,
  emailRegex,
} = require("../validations/validation");

const create_admin = async function (req, res) {
  try {
    let data = req.body;
    if (!data) {
      return res
        .status(400)
        .send({ message: "please provide data for admin Creation" });
    }
    let { name, number, email, password, address, userType } = data;
    let check_admin = await userModel.find({})
    for(let i=0; i<check_admin.length; i++){
      if(check_admin[i].userType == 'admin'){
        return res.status(400).send({
          message : 'admin is already there..!'
        })
      }
    }
    if (!isvalid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide name" });
    }
    if (!nameRegex.test(name)) {
      return res.status(400).send({
        status: false,
        message: "name should contain alphabets only.",
      });
    }

    if (!isvalid(number)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide number" });
    }
    if (!phoneRegex.test(number)) {
      return res.status(400).send({
        status: false,
        message: "Enter the phone number in valid Indian format.",
      });
    }

    if (!isvalid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide emailId" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid emailId" });
    }
    if (!isvalid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide password" });
    }
    if (!passRegex.test(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character.",
      });
    }
    const saltRounds = 8;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

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

    if (userType != undefined) {
      if (!isvalid(userType)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide userType" });
      }
    }
    let obj = {
      name : name,
      number : number,
      email : email,
      password : encryptedPassword,
      address : address,
      userType : 'admin',
    }
    if (req.file) {
      const { filename, path } = req.file;
      obj["image"] = {
        fileName: filename,
        fileAddress: path,
      };
    }
    await userModel.create(obj);
    return res.status(201).send({
      status: false,
      message: "admin created successfully",
      data: obj,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const admin_login = async function (req, res) {
  try {
    let data = req.body;
    if (!data) {
      return res
        .status(400)
        .send({ message: "please provide email and password for admin login" });
    }
    const { email, password } = data;
    if (!isvalid(email)) {
      return res.status(400).send({ message: "please provide email" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "please provide valid emailId" });
    }
    if (!isvalid(password)) {
      return res.status(400).send({
        message:
          "Please enter Password should be Valid min 8 and max 15 length",
      });
    }
    if (!passRegex.test(password)) {
      return res.status(400).send({
        message:
          "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character.",
      });
    }
    const admin = await userModel.findOne({ email });
    if (!admin) {
      return res.status(404).send({ message: "Invalid admin" });
    }

    const decrypPassword = admin.password;

    const pass = await bcrypt.compare(password, decrypPassword);

    if (!pass) {
      return res.status(400).send({ message: "Password Incorrect" });
    }

    let token = jwt.sign(
      {
        userId: admin._id.toString(),
        organisation: "Appzia-Technology",
      },
      "one-stop-service"
    );
    {
      res.setHeader("x-api-key", token);
    }
    {
      return res.status(201).send({
        status: true,
        message: "admin login successfully",
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const update_admin = async function (req, res) {
  try {
    let adminId = req.userId;
    let data = req.body;
    if (!data) {
      return res.status(400).send({
        message: "please provide data for update admin..!",
      });
    }
    let { name, number, email, password, address, image } = data;
    let admin = await userModel.findById(adminId);
    if (name != undefined) {
      if (!isvalid(name)) {
        return res.status(400).send({
          message: "please provide name for update Admin..!",
        });
      }
      if (!nameRegex.test(name)) {
        return res.status(400).send({
          message: "please provide valid name..!",
        });
      }
      if (admin.name == name) {
        return res.status(400).send({
          message: `please provide unique name ${name} is already exist..!`,
        });
      }
    }
    if (number != undefined) {
      if (!isvalid(number)) {
        return res.status(400).send({
          message: "please provide number..!",
        });
      }
      if (!phoneRegex.test(number)) {
        return res.status(400).send({
          message: "please provide valid number..!",
        });
      }
      if (admin.number == number) {
        return res.status(400).send({
          message: `${number} is already exist please provide unique number`,
        });
      }
    }
    if (email != undefined) {
      if (!isvalid(email)) {
        return res.status(400).send({
          message: "please provide email..!",
        });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).send({
          message: "please provide valid email..!",
        });
      }
      if (admin.email == email) {
        return res.status(400).send({
          message: `${email} is already exist, please provide unique email..!`,
        });
      }
    }
    if (password != undefined) {
      if (!isvalid) {
        return res.status(400).send({
          message: "please provide password..!",
        });
      }
      if (!passRegex.test(password)) {
        return res.status(400).send({
          message:
            "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character..!",
        });
      }
      const encryptedPassword = await bcrypt.hash(password, 8);
       data["password"] = encryptedPassword;
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
    let obj = {
      name : name ? name : admin.name,
      number : number ? number : admin.number,
      email : email ? email : admin.email,
      password : password ? password : admin.password,
      address : address ? address : admin.address,
      image : image ? image : admin.image
    };
    if (req.file) {
      const { filename, path } = req.file;
      obj["image"] = {
        fileName: filename,
        fileAddress: path,
      };
    }
   await userModel.findOneAndUpdate(
      { _id: adminId },
      { $set: data },
      { new: true }
    );
    return res.status(201).send({
      message: "admin update successfully...",
      data: obj,
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const delete_admin = async function (req, res) {
  try {
   let adminId = req.userId;
   let check_admin = await userModel.findById(adminId);
   if(!check_admin){
    return res.status(400).send({
      message : 'Admin is not there..!'
    })
   }
   await userModel.deleteOne({
    _id : adminId
   })
   return res.status(400).send({
    message : 'Admin deleted successfully..!'
   })
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  create_admin,
  admin_login,
  update_admin,
  delete_admin,
};
