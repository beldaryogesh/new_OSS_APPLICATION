const constant = require('../constant/constant');
const User = require('../model/authModel');

const businessDetails = async function(req, res, next){
    try {
        let {companyName, name, number, email, state, city, address} = req.body;
        if(!companyName){
            return res.status(200).json({error_code : 400, message : 'please provide company name..!'})
        }
        if(!name){
            return res.status(200).json({error_code : 400, message : 'please provide name..!'})
        }
        if(!number){
            return res.status(200).json({error_code : 400, message : 'please provide number..!'})
        }
        let num = await User.findOne({number});
        if(num){
            return res.status(200).json({error_code : 400, message : 'number is already exist..!'})
        }
        if(!email){
            return res.status(200).json({error_code : 400, message : 'please provide email..!'})
        }
        let ema = await User.findOne({email});
        if(ema){
            return res.status(200).json({error_code : 400, message : 'email is already exist..!'})
        }
        if(!address){
            return res.status(200).json({error_code : 400, message : 'please provide address..!'})
        }
        if(!state){
            return res.status(200).json({error_code : 400, message : 'please provide state..!'})
        }
        if(!city){
            return res.status(200).json({error_code : 400, message : 'please provide city..!'})
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

const update = async function (req, res, next) {
    try {
        let {companyName, name, email, address, state, city} = req.body;
        if(companyName != undefined){
            if(!companyName){
                return res.status(200).json({error_code : 200, message : 'please provide company name..!'})
            }
        }
        if(name != undefined){
            if(!name){
                return res.status(200).json({error_code : 200, message : 'please provide name..!'})
            }
        }
        if(email != undefined){
            if(!email){
                return res.status(200).json({error_code : 200, message : 'please provide email..!'})
            }
        }
        if(address != undefined){
            if(!address){
                return res.status(200).json({error_code : 200, message : 'please provide address..!'})
            }
        }
        if(state != undefined){
            if(!state){
                return res.status(200).json({error_code : 200, message : 'please provide state..!'})
            }
        }
        if(city != undefined){
            if(!city){
                return res.status(200).json({error_code : 200, message : 'please provide city..!'})
            }
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error_code: 500, message: 'Error inside upload documents..!' });
    }
};

const checkDocumentVerification = async function(req, res, next){
    try {
        let vendorId = req.userId;
        let vendor = await User.findOne({_id : vendorId});

        if (vendor.aadharStatus == constant.Pending && vendor.panStatus == constant.Pending) {
            return res.status(200).json({ error_code: 200, message: 'Please wait, your account is waiting for approval' });
        }

        if (vendor.aadharStatus == constant.Verify && vendor.panStatus == constant.Verify) {
            next();
        } else {
            return res.status(200).json({ error_code: 200, message: 'Sorry, you did not meet our criteria' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error_code: 500, message: 'Error inside check document verification middleware..!' });
    }
}

module.exports = {
    businessDetails,
    update,
    checkDocumentVerification
}
