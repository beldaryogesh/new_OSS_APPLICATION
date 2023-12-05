const constant = require('../constant/constant')
const User = require('../model/authModel');

const registerdVendor = async function(req, res){
    try {
        let user = await User.find({});
        let count = 0
        for(let i = 0; i<user.length; i++){
            if(user[i].userType == constant.Vendor){
                count++
            }
        }
        return res.status(200).json({error_code : 200, message : 'Total Vendor', count : count})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside registerdVendor..!'})
    }
};

const totalCustomer = async function(req, res){
    try {
        let user = await User.find({});
        let count = 0
        for(let i = 0; i<user.length; i++){
            if(user[i].userType == constant.User){
                count++
            }
        }
        return res.status(200).json({error_code : 200, message : 'Total Customer', count : count})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code :500, message : 'error inside totalCustomer,,!'})
    }
}

module.exports = {
    registerdVendor,
    totalCustomer
}