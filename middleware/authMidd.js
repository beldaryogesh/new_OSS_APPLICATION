const User = require('../model/authModel');

const register = async function(req, res, next){
    try {
        let {name, number, email, state, city} = req.body;
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


const address = async function(req, res, next){
    try {
        if(req.body == undefined){
            return res.status(200).json({error_code : 400, message : 'Empty Request Body'})
        }
        if(!req.body.address){
            return res.status(200).json({error_code : 400, message : 'Please Provide Address'})
        }
        if(!req.body.latitude){
            return res.status(200).json({error_code : 400, message : 'Please Provide latitude'})
        }
        if(!req.body.longitude){
            return res.status(200).json({error_code : 400, message : 'Please Provide longitude'})
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside address midd'})
    }
}

module.exports = {
    register,
    address
}
