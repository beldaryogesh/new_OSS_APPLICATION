const User = require('../model/authModel');
const sendOtp = require("../constant/otp");
const jwtToken = require("../constant/jwtToken");
const Otp = require('../model/otpModel');
const cities = require('country-state-city')
const constant = require('../constant/constant');

const register = async function(req, res){
    try {
        const otp = await sendOtp.sendOtp(req);
        let obj = {
            name : req.body.name,
            number : req.body.number,
            email : req.body.email,
            state : req.body.state,
            city : req.body.city,
        }
        let user = await User.create(obj);
        const token = await jwtToken(user);
        res.setHeader("x-api-key", token);
        return res.status(200).json({error_code : 200, message : 'Registration Successfully..!', otp : otp, token : token})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'errror inside register api..!'})
    }
}

const verifyOtp = async function (req, res) {
    try {
      let userId = req.userId;
      let otp = req.body.otp;
      if(!otp){
        return res.status(200).json({error_code : 400, message : 'please provide otp..!'})
      }
      let user = await User.findOne({_id : userId});
      let number = user.number;
      const find_number_otp = await Otp.findOne({number : number });
      if (!find_number_otp || find_number_otp.otp != otp) {
          return res.status(200).send({ error_code: 404, message: "Invalid OTP" });
      }
      return res.status(200).send({ error_code: 200, message: "OTP verification successfully" });
    } catch (error) {
      console.log(error)
      return res.status(500).send({ error_code: 500, message: error.message });
    }
};

const address = async function(req, res){
  try {
    let userId = req.userId;
    let obj = {
      address : req.body.address ? req.body.address : undefined,
      latitude : req.body.latitude ? req.body.latitude : undefined,
      longitude : req.body.longitude ? req.body.longitude : undefined
    }
    await User.findOneAndUpdate({_id : userId}, {$set : obj}, {new : true});
    return res.status(200).json({errro_code : 200, message : 'address added successfully..!'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({error_code : 500, message : 'error inside address api..!'})
  }
}

const stateList = async function(req, res){
    try {
      let states = cities.State.getStatesOfCountry('IN')
      let result = []
      for(let i= 0; i<states.length; i++){
        result.push(states[i].name)
      }
      return res.status(200).send({error_code : 200, message : 'state list', states : result})
    } catch (error) {
      console.log(error);
      return res.status(500).send({error_code : 500, message : 'error insode state list api..!!'})
    }
}
  
const cityList = async function(req, res){
    try{
    const stateName = req.body.state;
    if(!req.body.state){
      return res.status(200).json({error_code : 200, message : 'please provide state name..!'})
    }
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
    return res.status(200).send({error_code : 200, message : 'city list', city : result})
    }catch(error){
      console.log(error)
      return res.status(500).send({error_code : 500, message : 'error inside city list..!'})
    }
}

const login = async function(req, res){
    try {
        let user = await User.findOne({number : req.body.number})
        if(!user){
          return res.status(200).json({error_code : 404, message : 'user not exist..!'})
        }
        const otp = await sendOtp.updateOtp(req);
        const token = await jwtToken(user);
        return res.status(200).json({error_code : 200, message : 'otp send successfully..!', otp : otp, token : token});
    } catch (error) {
        console.log(error);
        return res.status(200).json({error_code : 500, message : 'error inside login api..!'})
    }
}

const loginWithGoogle = async function (req, res) {
    try {
      let Id = req.body.Id
      let check_Id = await User.findOne({ Id: Id })
      if (!check_Id) {
        let obj = {
          Id: req.body.Id,
          registerWith: constant.Google
        }
        let user = await User.create(obj)
        user.save()
        return res.status(200).json({error_code : 200, message: 'User got created..!'})
      }
      if (check_Id.number) {
        const token = await jwtToken(check_Id);
        return res.status(201).json({ error_code : 200, message: 'login successfully..', token: token })
      }else{
        return res.status(200).json({error_code : 200, message : 'User got created..!'})
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({error_code : 500,  message: 'error inside loginWithGoogle' })
    }
}
  
const loginWithFaceBook = async function (req, res) {
    try {
      let Id = req.body.Id
      let check_Id = await User.findOne({ Id: Id })
      if (!check_Id) {
        let obj = {
          Id: req.body.Id,
          registerWith: constant.FaceBook
        }
        await User.create(obj)
        return res.status(200).json({error_code : 200, message: 'User got created..!'})
      }
      if (check_Id.number) {
        const token = await jwtToken(check_Id);
        return res.status(201).json({ error_code : 200, message: 'login successfully..', token: token })
      }else{
        return res.status(200).json({error_code : 200, message : 'User got created..!'})
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({error_code : 500,  message: 'error inside loginWithFaceBook' })
    }
}
  
const registrationWithsocialMedia = async function (req, res) {
    try {
      const otp = await sendOtp.sendOtp(req);
      let userId = req.body.Id;
      let obj = {
        name: req.body.name ? req.body.name : undefined,
        number: req.body.number ? req.body.number : undefined,
        email: req.body.email ? req.body.email : undefined,
        state: req.body.state ? req.body.state : undefined,
        city: req.body.city ? req.body.city : undefined,
      };
    let user2 = await User.findOneAndUpdate({ Id: userId }, { $set: obj }, { new: true });
    const token =  jwtToken(user2);
    res.setHeader("x-api-key", token);
    return res.status(201).json({error_code : 200, message: 'otp send succssfully', otp : otp , token : token})
  
    } catch (error) {
      console.log(error);
      return res.status(500).send({error_code : 500, message: 'error inside registrationWithGoogle ' })
    }
}

module.exports = {
    register,
    verifyOtp,
    address,
    stateList,
    cityList,
    login,
    loginWithGoogle,
    loginWithFaceBook,
    registrationWithsocialMedia
}


