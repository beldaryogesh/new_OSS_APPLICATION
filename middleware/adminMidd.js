const Admin = require('../model/adminModel')
const bcrypt = require('bcryptjs');
let { passRegex} = require('../constant/validation');

const createAdmin = async function(req, res, next){
    try {
        let {name, number, email, password} = req.body;
        let admin = await Admin.findOne({});
        if(admin){
            return res.status(200).json({error_code : 200, message : 'admin is already exist..!'})
        }
        if(!name){
            return res.status(200).json({error_code : 200, message : 'please provide name..!'})
        }
        if(!number){
            return res.status(200).json({error_code : 200, message : 'please provide number..!'})
        }
        if(!email){
            return res.status(200).json({error_code : 200, message : 'please provide email..!'})
        }
        if(!password){
            return res.status(200).json({error_code : 200, message : 'please provide password..!'})
        }
        if (!passRegex.test(password)) {
            return res.status(200).json({error_code: 400, message:"please provide strong password. useing Upppercase, numbers and special charectores..!"});
          }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside create admin midd..!'})
    }
}


const adminLogin = async function(req, res, next){
    try{
        if(!req.body.email){
            return res.status(200).json({error_code : 200, message : 'please provide email..!'})
        }
        if(!req.body.password){
            return res.status(200).json({error_code : 200, message : 'please provide password..!'})
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside admin login midd..!'})
    }
}

const updateAdmin = async function(req, res, next){
    try{
        let {name, number, email, password} = req.body;
        if(name != undefined){
            if(!name){
                return res.status(200).json({error_code : 200, message : 'please provide name..!'})
            }
        }
        if(number != undefined){
            if(!number){
                return res.status(200).json({error_code : 200, message : 'please provide number..!'})
            }
        }
        if(email != undefined){
            if(!email){
                return res.status(200).json({error_code : 200, message : 'please provide email..!'})
            }
        }
        if(password != undefined){
            if(!password){
                return res.status(200).json({error_code : 200, message : 'please provide password..!'})
            }
        }
        next()       
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside admin midd..!'})
    }
}

const password = async function(req, res, next){
    try{
        if(req.body == undefined){
          return res.status(200).json({ error_code: 400, message: "empty body..!" });
        }
        let adminId = req.userId;
        let admin = await Admin.findOne({_id : adminId});
        let {oldPassword, newPassword, confirmPassword} = req.body;
        if (!oldPassword) {
           return res.status(200).json({ error_code: 400, message: "please provide oldPassword..!" });
        }

        if (!newPassword) {
          return res.status(200).json({ error_code: 400, message: "please provide newPassword..!" });
        }
        if (!passRegex.test(newPassword)) {
          return res.status(200).json({error_code: 400, message:"please provide strong password. useing Upppercase, numbers and special charectores..!"});
        }
        if (!confirmPassword) {
          return res.status(200).json({ error_code: 400, message: "please provide confirmPassword..!" });
        }
        if (newPassword != confirmPassword) {
            return res.status(200).json({ error_code: 400, message: "new password and confirm password is Incorrect..!" });
        }
        if(!admin){
           return res.status(200).json({ error_code: 400, message: "admin not exist..!" });
        }
        const decrypPassword = admin.password;
        const pass = await bcrypt.compare(oldPassword, decrypPassword);
        if (!pass) {
          return res.status(200).json({ error_code: 400, message: "Incorrect old passoword password..!" });
        }
        next()
    }catch(error){
        console.log(error)
        return res.status(500).json({error_code : 500, message : 'error inside password middleware..!'})
    }
}

module.exports = {
    createAdmin,
    adminLogin,
    updateAdmin,
    password
}