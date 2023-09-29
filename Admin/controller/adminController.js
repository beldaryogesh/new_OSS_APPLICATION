const userModel = require("../../User/models/userModel");
const pinValidator = require("pincode-validator");
const baseUrlUtils = require('../../middlwares/baseURL')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  nameRegex,
  phoneRegex,
  emailRegex,
  passRegex,
} = require("../../validations/validation");

const create_admin = async function (req, res) {
  try {
    let data = req.body;
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    if (!data) {
      return res
        .status(400)
        .send({error_code : 500, message: "please provide data for admin Creation" });
    }
    let { name, number, email, password, state, city, userType } = data;
    let check_admin = await userModel.find({});
    for (let i = 0; i < check_admin.length; i++) {
      if (check_admin[i].userType == "admin") {
        return res.status(400).send({
          error_code : 500,
          message: "admin is already there..!",
        });
      }
    }
    if (!name) {
      return res
        .status(400)
        .send({ error_code: 500, message: "please provide name" });
    }
    if (!nameRegex.test(name)) {
      return res.status(400).send({
        error_code: 400,
        message: "name should contain alphabets only.",
      });
    }

    if (!number) {
      return res
        .status(400)
        .send({ error_code: 400, message: "please provide number" });
    }
    if (!phoneRegex.test(number)) {
      return res.status(400).send({
        error_code: 400,
        message: "Enter the phone number in valid Indian format.",
      });
    }

    if (!email) {
      return res
        .status(400)
        .send({ error_code: 400, message: "please provide emailId" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ error_code: 400, message: "please provide valid emailId" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ error_code: 400, message: "please provide password" });
    }
    if (!passRegex.test(password)) {
      return res.status(400).send({
        error_code: 400,
        message:
          "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character.",
      });
    }
    const saltRounds = 8;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    if (!state)
      return res.status(400).send({
        error_code: 400,
        message: "Enter the state name..!",
      });
    if (!nameRegex.test(state)) {
      return res.status(400).send({
        error_code: 400,
        message: "please provide valid state name..!",
      });
    }
    if (!city) {
      return res.status(400).send({error_code: 400,  message: "please provide city name..!" });
    }
    if (!nameRegex.test(city)) {
      return res.status(400).send({
        error_code: 400,
        message: "please provide valid city name..!",
      });
    }

    if (userType != undefined) {
      if (!userType) {
        return res
          .status(400)
          .send({ error_code: 400, message: "please provide userType" });
      }
    }
    let obj = {
      name: name,
      number: number,
      email: email,
      password: encryptedPassword,
      state: state,
      city: city,
      userType: "admin",
    };
    if (req.files.length <= 1) {
      obj["profileImage"] =  baseUrl + '/uploads/' +  req.files[0].filename;
    }

    await userModel.create(obj);
    return res.status(201).send({
      error_code: 200,
      message: "admin created successfully",
      data: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error_code: 500, message: error.message });
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
    if (!email) {
      return res.status(400).send({ error_code: 400,
        message: "please provide email" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).send({ error_code: 400,
        message: "please provide valid emailId" });
    }
    if (!password) {
      return res.status(400).send({
        error_code: 400,
        message:
          "Please enter Password should be Valid min 8 and max 15 length",
      });
    }
    if (!passRegex.test(password)) {
      return res.status(400).send({
        error_code: 400,
        message:
          "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character.",
      });
    }
    const admin = await userModel.findOne({ email });
    if (!admin) {
      return res.status(404).send({error_code : 400, message: "Invalid admin" });
    }

    const decrypPassword = admin.password;

    const pass = await bcrypt.compare(password, decrypPassword);

    if (!pass) {
      return res.status(400).send({error_code: 400, message: "Password Incorrect" });
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
        error_code: 200,
        message: "admin login successfully",
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).send({ error_code: 500, message: error.message });
  }
};

const update_admin = async function (req, res) {
  try {
    let adminId = req.userId;
    let data = req.body;
    let baseUrl = baseUrlUtils.generateBaseUrl(req);
    if (!data) {
      return res.status(400).send({
        message: "please provide data for update admin..!",
      });
    }
    let { name, number, email, password, state, city, profileImage } = data;
    let admin = await userModel.findById(adminId);
    if (name != undefined) {
      if (!name) {
        return res.status(400).send({
          error_code: 400,
          message: "please provide name for update Admin..!",
        });
      }
      if (!nameRegex.test(name)) {
        return res.status(400).send({
          error_code: 400,
          message: "please provide valid name..!",
        });
      }
      if (admin.name == name) {
        return res.status(400).send({
          error_code : 400,
          message: `please provide unique name ${name} is already exist..!`,
        });
      }
    }
    if (number != undefined) {
      if (!number) {
        return res.status(400).send({
          error_code: 400,
          message: "please provide number..!",
        });
      }
      if (!phoneRegex.test(number)) {
        return res.status(400).send({
          error_code: 400,
          message: "please provide valid number..!",
        });
      }
      if (admin.number == number) {
        return res.status(400).send({
          error_code : 400,
          message: `${number} is already exist please provide unique number`,
        });
      }
    }
    if (email != undefined) {
      if (!email) {
        return res.status(400).send({
          error_code : 400,
          message: "please provide email..!",
        });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).send({
          error_code : 400,
          message: "please provide valid email..!",
        });
      }
      if (admin.email == email) {
        return res.status(400).send({
          error_code : 400,
          message: `${email} is already exist, please provide unique email..!`,
        });
      }
    }
    if (password != undefined) {
      if (!password) {
        return res.status(400).send({
          error_code : 400,
          message: "please provide password..!",
        });
      }
      if (!passRegex.test(password)) {
        return res.status(400).send({
          error_code : 400,  
          message:
            "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character..!",
        });
      }
      const encryptedPassword = await bcrypt.hash(password, 8);
      data["password"] = encryptedPassword;
    }
    if (state != undefined) {
      if (!state)
        return res.status(400).send({
          error_code: 400,
          message: "Enter the state name..!",
        });
      if (!nameRegex.test(state)) {
        return res.status(400).send({
          error_code: 400,
          message: "please provide valid state name..!",
        });
      }
    }
    if (city != undefined) {
      if (!city) {
        return res.status(400).send({error_code: 400, message: "please provide city name..!" });
      }
      if (!nameRegex.test(city)) {
        return res.status(400).send({
          error_code: 400,
          message: "please provide valid city name..!",
        });
      }
    }
    let obj = {
      name: name ? name : admin.name,
      number: number ? number : admin.number,
      email: email ? email : admin.email,
      password: password ? password : admin.password,
      state: state ? state : admin.state,
      city: city ? city : admin.city,
      profileImage: profileImage ? profileImage : admin.profileImage,
    };
    if (req.files) {
      obj["profileImage"] =baseUrl + '/uploads/' + req.files[0].filename
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
    console.log(error);
    return res.status(500).send({error_code: 500, message: error });
  }
};

const delete_admin = async function (req, res) {
  try {
    let adminId = req.userId;
    let check_admin = await userModel.findById(adminId);
    if (!check_admin) {
      return res.status(400).send({
        error_code : 400,
        message: "Admin is not there..!",
      });
    }
    await userModel.deleteOne({
      _id: adminId,
    });
    return res.status(400).send({
      error_code : 400,
      message: "Admin deleted successfully..!",
    });
  } catch (error) {
    return res.status(500).send({error_code : 500, message: error });
  }
};

module.exports = {
  create_admin,
  admin_login,
  update_admin,
  delete_admin,
};
