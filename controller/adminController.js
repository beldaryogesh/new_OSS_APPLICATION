const Admin = require('../model/adminModel');
const baseURL = require("../constant/baseURL");
const bcrypt = require("bcryptjs");
const jwtToken = require("../constant/jwtToken");

const createAdmin = async function (req, res) {
    try {
      const saltRounds = 8;
      const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
      let obj = {
        name: req.body.name ? req.body.name : undefined,
        number: req.body.number ? req.body.number : undefined,
        email: req.body.email ? req.body.email : undefined,
        password: encryptedPassword ? encryptedPassword : undefined,
      };
      if (req.files.length > 0) {
        obj["profileImage"] = "/uploads/" + req.files[0].filename;
      }
      await Admin.create(obj);
      return res.status(200).json({ error_code: 200, message: "admin created successfully..!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error_code: 500, message: "error inside create admin..!" });
    }
};

const adminLogin = async function (req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(200).json({ error_code: 400, message: "Invalid admin" })
      }
      const decrypPassword = admin.password;
  
      const pass = await bcrypt.compare(password, decrypPassword);
      if (!pass) {
        return res.status(200).json({ error_code: 400, message: "Password Incorrect" });
      }
      const token = jwtToken(admin);
      res.setHeader("x-api-key", token);
      {
        return res.status(201).json({error_code: 200, message: "admin login successfully", token: token});
      }
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error_code: 500, message: 'error inside admin login..!' });
    }
};

const updateAdmin = async function(req, res){
    try{
        let adminId = req.userId;
        let obj = {
            name : req.body.name ? req.body.name : undefined,
            email : req.body.email ? req.body.email : undefined,
            number : req.body.number ? req.body.number : undefined,
        }
        if (req.files.length > 0) {
            obj["profileImage"] = "/uploads/" + req.files[0].filename;
        }
        await Admin.findOneAndUpdate({_id : adminId}, {$set : obj}, {new : true})
        return res.status(200).json({error_code : 200, message : 'admin update successfully..!'})
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update Admin in admin controller..!'})
    }
};

const change_password = async function (req, res){
    try{
      let adminId = req.userId;
      const encryptedPassword = await bcrypt.hash(req.body.confirmPassword, 8);
      let obj = {
        password : encryptedPassword ? encryptedPassword : undefined
      }
      await Admin.findByIdAndUpdate({ _id: adminId },{ $set: obj },{ new: true }); 
      return res.status(200).json({error_code : 200, message : 'password update successfully..!'})
    }catch(error){
        console.log(error)
        return res.status(500).json({error_code : 500, message : 'error inside change password'})
    }
}

const getAdminProfile = async function(req, res){
  try{
    let baseUrl = baseURL.generateBaseUrl(req);
    let adminId = req.userId;
    let admin = await Admin.findById(adminId);
    if(!admin){
      return res.status(200).json({error_code : 404, message : 'admin not exist..!'})
    }
    let obj = {
      name : admin.name ? admin.name : undefined,
      email : admin.email ? admin.email : undefined,
      number : admin.number ? admin.number : undefined,
      profileImage :  baseUrl + admin.profileImage ? baseUrl + admin.profileImage : undefined
    }
    return res.status(200).json({errro_code : 200, obj})

  }catch(error){
    console.log(error);
    return res.status(500).json({error_code : 500, message : 'error inside getAdminProfile in Admin controller..!'})
  }
}

module.exports = {
    updateAdmin,
    adminLogin,
    createAdmin,
    change_password,
    getAdminProfile
}