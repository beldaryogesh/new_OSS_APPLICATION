const Subscription = require('../model/subscriptionModel');
const Service = require('../model/adminServiceModel');

const addSubscription = async function(req, res){
    try {
        let obj = {
            serviceType : req.body.serviceType ? req.body.serviceType : undefined,
            description : req.body.description ? req.body.description : undefined,
            planName : req.body.planName ? req.body.planName : undefined,
            planValidity : req.body.planValidity ? req.body.planValidity : undefined,
            amount : req.body.amount ? req.body.amount : undefined,
        };
        await Subscription.create(obj)
        return res.status(200).json({error_code : 200, message : 'subscription plan added successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add subscription..!'})
    }
}

const getServiceName = async function(req, res){
    try {
        let service = await Service.find({});
        if(service.length == 0){
            return res.status(200).json({error_code : 404, message : 'service not exist..!'})
        }
        let data = [];
        for(let i=0; i<service.length; i++){
            data.push(service[i].serviceName)
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get service name in subscription controller'})
    }
}

const getSubscription = async function(req, res){
    try{
        let subscription = await Subscription.find({});
        if(subscription.length == 0){
            return res.status(200).json({error_code : 404, message : 'no subscription plan exist..!'})
        }
        let data = [];
        let sr = 1;
        for(let i =0; i<subscription.length; i++){
            data.push({
                SrNo: sr++,
                ServiceName : subscription[i].serviceType,
                PlanName : subscription[i].planName,
                Validity : subscription[i].planValidity,
                Amount: subscription[i].amount,
                Description : subscription[i].description,
                Status : subscription[i].status,
                subscriptionId : subscription[i]._id,
                date : subscription[i].createdAt,
            })
        }
        return res.status(200).json({error_code : 200, data})
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get subscription..!'})
    }
}

const updateSubscription = async function(req, res){
    try {
        let subscriptionId = req.body.subscriptionId;
        let obj = {
            serviceType : req.body.serviceType ? req.body.serviceType : undefined,
            description : req.body.description ? req.body.description : undefined,
            planName : req.body.planName ? req.body.planName : undefined,
            planValidity : req.body.planValidity ? req.body.planValidity : undefined,
            amount : req.body.amount ? req.body.amount : undefined,
        };
        await Subscription.findOneAndUpdate({_id : subscriptionId}, {$set : obj}, {new : true})
        return res.status(200).json({error_code : 200, message : 'subscription plan update successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update subscription..!'})
    }
}

const updateStatus = async function(req, res){
    try{
        let subscriptionId = req.body.subscriptionId;
        let subscription = await Subscription.findOne({_id : subscriptionId});
        subscription.status = req.body.status;
        subscription.save();
        return res.status(200).json({error_code : 200, message : 'status update successfully..!'})
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update status in subscription controller..!'})
    }
}

const deleteSubscription = async function(req, res){
    try {
        let subscriptionId = req.body.subscriptionId;
        let subscription = await Subscription.findOneAndDelete({_id : subscriptionId});
        if(!subscription){
            return res.status(200).json({error_code : 400, message : 'subscription plan not exist..!'})
        }
        return res.status(200).json({error_code : 200, message : 'subscription plan deleted successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside delete subscription..!'})
    }
}



module.exports = {
    addSubscription,
    getServiceName,
    getSubscription,
    updateSubscription,
    updateStatus,
    deleteSubscription
};


