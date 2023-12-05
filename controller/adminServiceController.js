const AdminService = require('../model/adminServiceModel');
const baseURL = require("../constant/baseURL");

const addService = async function(req, res){
    try{
        let obj = {
            serviceName : req.body.serviceName ? req.body.serviceName : undefined,
            description : req.body.description ? req.body.description : undefined,
        }
        if (req.files.length > 0) {
            obj["serviceImage"] = "/uploads/" + req.files[0].filename;
        }
        await AdminService.create(obj)
        return res.status(200).json({error_code : 200, message : 'service added successfully..!'})
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add service api in admin service controller..!'})
    }
}

const getAdminService = async function(req, res){
    try{
        let baseUrl = baseURL.generateBaseUrl(req);
        let service = await AdminService.find({})
        if(service.length == 0){
            return res.status(200).json({error_code : 200, message : 'service not exist..!'})
        }
        let data = [];
        let sr = 1;
        for(let i=0; i<service.length; i++){
            data.push({
                SrNo: sr++,
                ServiceName : service[i].serviceName,
                Description : service[i].description,
                Image : baseUrl + service[i].serviceImage,
                serviceId : service[i]._id
            })
        }   
        return res.status(200).json({error_code : 200, data})
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get admin service api in admin service controller..!'})
    }
}

const updateAdminService = async function(req, res){
    try{
        let serviceId = req.body.serviceId;
        let obj = {
            serviceName : req.body.serviceName ? req.body.serviceName : undefined,
            description : req.body.description ? req.body.description : undefined,
        }
        if (req.files.length > 0) {
            obj["serviceImage"] = "/uploads/" + req.files[0].filename;
        }
        await AdminService.findOneAndUpdate({_id : serviceId}, {$set : obj}, {new : true});
        return res.status(200).json({error_code : 200, message : 'service update successfully..!'})

    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside updateAdminService in admin service controller..!'})
    }
}

const deleteAdminService = async function(req, res){
    try{
        let serviceId = req.body.serviceId;
        let service = await AdminService.findByIdAndDelete(serviceId);
        if(!service){
            return res.status(200).json({error_code : 400, message : 'service not exist..!'})
        }
        return res.status(200).json({error_code : 200, message : 'service deleted successfully..!'})
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside deleteAdminService in admin service controller..!'})
    }
}

module.exports = {
    addService,
    getAdminService,
    updateAdminService,
    deleteAdminService
}



