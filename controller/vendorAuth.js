const Vendor = require('../model/authModel');
const sendOtp = require("../constant/otp");
const jwtToken = require("../constant/jwtToken");
const Otp = require('../model/otpModel');
const AdminService = require('../model/adminServiceModel');
const constant = require('../constant/constant');

const businessDetails = async function (req, res){
    try {
        const otp = await sendOtp.sendOtp(req);
        let obj = {
            companyName : req.body.companyName,
            name : req.body.name,
            number : req.body.number,
            email : req.body.email,
            state : req.body.state,
            city : req.body.city,
            userType : constant.Vendor,
            address : req.body.address
        }
        let vendor = await Vendor.create(obj);
        const token = await jwtToken(vendor);
        res.setHeader("x-api-key", token);
        return res.status(200).json({error_code : 200, message : 'continue', otp : otp, token : token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside business details api..!'})
    }
};


const selectLanguage = async function(req, res){
    try {
        if(req.body == undefined){
            return res.status(200).json({errro_code : 400, message : 'Empty Request Body'})
        }
        if(!req.body.language){
            return res.status(200).json({errro_code : 400, message : 'Please Provide Language'})
        }
        let vendorId = req.userId;
        let vendor = await Vendor.findOne({_id : vendorId});
        vendor.language = req.body.language
        vendor.save()
        return res.status(200).json({error_code : 200, message : 'Save and Continue'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside select language api..!'})
    }
};

const getServiceType = async function(req, res){
    try {
        let service = await AdminService.find({});
        if(service.length == 0){
            return res.status(200).json({error_code : 404, message : 'no type of service exist..!'})
        }
        let data = []
        for(let i = 0; i < service.length; i++){
            data.push(service[i].serviceName)
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get service type..!'})
    }
}

const whereDoYouWork = async function (req, res){
    try {
        let userId = req.userId;
        let obj = {
            whereDoYouWork : req.body.whereDoYouWork ? req.body.whereDoYouWork : undefined,
            latitude : req.body.latitude ? req.body.latitude : undefined,
            longitude : req.body.longitude ? req.body.longitude : undefined
        }
        await Vendor.findOneAndUpdate({_id : userId}, {$set : obj}, {new : true});
        return res.status(200).json({errro_code : 200, message : 'added successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside where do you work api..!'})
    }
}

const selectServiceType = async function(req, res){
    try {
        let vendorId = req.userId;
        if(!req.body.serviceType){
            return res.status(200).json({error_code : 400, message : 'please provide service type..!'})
        }
        let obj = {
            serviceType : req.body.serviceType ? req.body.serviceType : undefined
        }
        await Vendor.findOneAndUpdate({_id : vendorId}, {$set : obj}, {new : true});
        
        return res.status(200).json({error_code : 200, message : 'continue'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'selectServiceType'})
    }
};

const uploadDocuments = async function(req, res){
    try {
        let vendorId = req.userId;
        let vendor = await Vendor.findOne({_id : vendorId})
        for(let i=0; i<req.files.length; i++){
            if(req.files[i].fieldname == constant.BusinessProfileImage){
                vendor.businessProfileImage = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.AadharCard){
                vendor.aadharCard = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.PanCard){
                vendor.panCard = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.AddressProof){
                vendor.addressProof = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.BannerImage){
                vendor.bannerImage.push("/uploads/" + req.files[i].filename)
            }
            if(req.files[i].fieldname == constant.ServiceImage){
               vendor.serviceImage.push("/uploads/" + req.files[i].filename)
            }
        };
        vendor.save()
        return res.status(200).json({error_code : 200, message : 'Upload Document'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside upload documents..!'})
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
        userType : constant.Vendor,
        address : req.body.address ? req.body.address : undefined
      };
    let user2 = await Vendor.findOneAndUpdate({ Id: userId }, { $set: obj }, { new: true });
    const token =  jwtToken(user2);
    res.setHeader("x-api-key", token);
    return res.status(201).json({error_code : 200, message: 'otp send succssfully', otp : otp , token : token})
  
    } catch (error) {
      console.log(error);
      return res.status(500).send({error_code : 500, message: 'error inside registrationWithGoogle ' })
    }
};


const getFilldetails = async function(req, res){
    try {
      let vendorId = req.userId;
      let vendor = await Vendor.findOne({_id : vendorId});
      let data = { };
      if(vendor.number && vendor.companyName){
        data['bisinessDetails'] = 1;
      }else{
        data['bisinessDetails'] = 0;
      }
      if(vendor.language ){
        data['Language'] = 1;
      }else{
        data['Language'] = 0;
      }
      if(vendor.serviceType){
        data['ServiceOffered'] = 1;
      }else{
        data['ServiceOffered'] = 0;
      }
      if(vendor.whereDoYouWork || vendor.latitude){
        data['TargetLocation'] = 1;
      }else{
        data['TargetLocation'] = 0;
      }
      if(vendor.aadharCard && vendor.panCard){
        data['KYCdocument'] = 1;
      }else{
        data['KYCdocument'] = 1;
      };
      return res.status(200).json({error_code : 200, message : 'Submit For Approval', data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({error_code : 500, message : 'error inside getFilldetails'})
    }
  }

module.exports = {
    businessDetails,
    selectLanguage,
    whereDoYouWork,
    getServiceType,
    selectServiceType,
    uploadDocuments,
    registrationWithsocialMedia,
    getFilldetails
}