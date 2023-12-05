const constant = require('../constant/constant');
let {SubscriptionStatusRegex} = require('../constant/validation');

const addContactUs = async function(req, res, next){
    try {
        if(!req.body.number){
            return res.status(200).json({error_code : 400, message : 'please provide number..!'})
        }
        if(!req.body.address){
            return res.status(200).json({error_code : 400, message : 'please provide address..!'})
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error in add contact us midd..!'})
    }
};

const updateContactDetails = async function(req, res, next){
    try {
        if(req.body.number != undefined){
            if(!req.body.number){
                return res.status(200).json({error_code : 400, message : 'please provide number..!'})
            }
        }
        if(req.body.address != undefined){
            if(!req.body.address){
                return res.status(200).json({error_code : 400, message : 'please provide address..!'})
            }
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside updateContactDetails midd..!'})
    }
}

const status = async function(req, res, next){
    try {
        if(!req.body.status){
            return res.status(200).json({error_code : 400, message : 'please provide status..!'})
        }
        if(!SubscriptionStatusRegex.test(req.body.status)){
            return res.status(200).json({error_code : 400, message : `please provide ${constant.Active}, ${constant.Deactivate} values..!`})
        }
        next()
    } catch (error) {
        consle.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside status midd..!'})
    }
}

module.exports = {
    addContactUs,
    updateContactDetails,
    status
}
