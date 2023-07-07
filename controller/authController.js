const userModel = require("../models/userModel");
const otpGenerator = require("otp-generator");
const pinValidator = require("pincode-validator");
const Otp = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  isValidRequestBody,
  isvalid,
  nameRegex,
  phoneRegex,
  emailRegex,
  passRegex,
  usertypeRegex,
} = require("../validations/validation");

const registerUser = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        message:
          "please provide  name, number, email, password, address, userType for registation",
      });
    }

    let { name, number, email, password, address, userType } = data;

    let obj = { };
    if(req.file){
      const { filename, path } = req.file;
      obj['image'] = {
        fileName: filename,
        fileAddress: path,
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
    obj["name"] = name;
    if (!isvalid(number))
      return res
        .status(400)
        .send({ status: false, message: "Please enter the phone number." });
    if (!phoneRegex.test(number))
      return res.status(400).send({
        status: false,
        message: "Enter the phone number in valid Indian format.",
      });
    let getnumber = await userModel.findOne({ number: number });
    if (getnumber) {
      return res.status(400).send({
        status: false,
        message: "number is already in use, please enter a new one.",
      });
    }
    obj["number"] = number;
    let getEmail = await userModel.findOne({ email: email });
    if (getEmail) {
      return res.status(400).send({
        sttaus: false,
        message: "email is already in use , please enter a new one",
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
        .send({ status: false, message: "please provide valid emailID" });
    }
    obj["email"] = email;
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
    obj["password"] = encryptedPassword;

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

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let otp_new = await Otp.create({
      number: req.body.number,
      otp,
    });

    obj["otp"] = otp_new._id;
    if (userType) {
      if (!isvalid(userType)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide userType" });
      }
      if (!usertypeRegex.test(userType)) {
        return res.status(400).send({
          status: false,
          message: "you can only provide customer and vendor userType",
        });
      }
      obj["userType"] = userType;
    }
    await userModel.create(obj);
    return res.status(201).send({
      status: true,
      data: "register successfully",
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
}; 

const loginUser = async function (req, res) {
  try {
    const { number } = req.body;
    if (!isValidRequestBody(req.body)) {
      return res.status(400).send({
        status: false,
        message: "please provide number for user login",
      });
    }

    let user = await userModel.findOne({ number });
    if (!user) {
      return res.status(400).send({
        status: false,
        message: `no user registerd with ${number} number please register then you will be eligible to login`,
      });
    } 
    const otp = otpGenerator.generate(6, {
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
        .send({ status: true, message: `your otp is ${otp}`, token: token });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const verifyOtp = async function (req, res) {
  try {
    let data = req.body;
    let userId = req.userId;
    if (!isValidRequestBody(data)) {
      return res
        .status(400)  
        .send({ status: false, message: "please provide otp in body" });
    }

    const { otp } = data;
    if (!isvalid(otp)) {
      return res.status(400).send({
        status: false,
        message: "please provide otp, opt filed is empty",
      });
    }
    let user = await userModel.findById(userId);
    let number = user.number;
    const find_number_otp = await Otp.findOne({ number, otp });
    if (!find_number_otp) {
      return res.status(404).send({ error: "Invalid Number" });
    }
    return res.status(200).send({ message: "OTP verification successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyOtp };