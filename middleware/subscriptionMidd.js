const constant = require('../constant/constant');
const { planValidityRegex, SubscriptionStatusRegex } = require('../constant/validation')

const addSubscription = async function(req, res, next){
    try {
        let { serviceType, description, planName, planValidity, amount } = req.body;
        if(!serviceType){
            return res.status(200).json({error_code : 400, message : 'please provide type of service..!'})
        }
        if(!planName){
            return res.status(200).json({error_code : 400, message : 'please provide plan name..!'})
        }
        if(!planValidity){
            return res.status(200).json({error_code : 400, message : 'please provide plan validity..!'})
        }
        if(!planValidityRegex.test(planValidity)){
            return res.status(200).json({error_code : 400, message: `pleae provide only ${constant.Monthly}, ${constant.Quarterly}, ${constant.Yearly} validity..!`})
        }
        if(!amount){
            return res.status(200).json({error_code : 400, message : 'please provide amount..!'})
        }
        if(!description){
            return res.status(200).json({error_code : 400, message : 'please provide description..!'})
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside addSubscription midd..!'})
    }
}

const updateSubscription = async function(req, res, next){
    try {
        let {serviceType, description, planName, planValidity, amount } = req.body;
        if(serviceType != undefined){
            if(!serviceType){
                return res.status(200).json({error_code : 200, message : 'please provide service type..!'})
            }
        }
        if(description != undefined){
            if(!description){
                return res.status(200).json({error_code : 200, message : 'please provide description..!'})
            }
        }
        if(planName != undefined){
            if(!planName){
                return res.status(200).json({error_code : 200, message : 'please provide plan name..!'})
            }
        }
        if(planValidity != undefined){
            if(!planValidity){
                return res.status(200).json({error_code : 200, message : 'please provide plan validity..!'})
            }
            if(!planValidityRegex.test(planValidity)){
                return res.status(200).json({error_code : 400, message: `pleae provide only ${constant.Monthly}, ${constant.Quarterly}, ${constant.Yearly} validity..!`})
            }
        }
        if(amount != undefined){
            if(!amount){
                return res.status(200).json({error_code : 200, message : 'please provide amount..!'})
            }
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update subscription middleware..!'})
    }
}

const updateStatus = async function(req, res, next){
    try{
        if(!req.body.status){
            return res.status(200).json({error_code : 400, message : 'please provide status..!'})
        }
        if(!SubscriptionStatusRegex.test(req.body.status)){
            return res.status(200).json({error_code : 400, message : `please provide only ${constant.Active} and ${constant.Deactivate} value..!`})
        }
        next()
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update status midd in subscription midd..!'})
    }
}

module.exports = {
    addSubscription,
    updateSubscription,
    updateStatus
}