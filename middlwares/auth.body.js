const userModel = require('../User/models/userModel');
const {nameRegex, emailRegex, phoneRegex } = require('../validations/validation')

const checkBody = async function(req, res, next){
    try{
        let data = req.body;
        let check_number = await userModel.findOne({number : req.body.number})
        let check_email = await userModel.findOne({email : req.body.email})
        let {name, number, email, state, city} = data;
        
        if(!name){
            return res.status(200).send({error_code : 400, message : 'please provide name'});
        }
        if(!nameRegex.test(name)){
            return res.status(200).send({error_code : 400, message : 'please provide valid name..!'});
        }
        if(!number){
            return res.status(200).send({error_code : 400, message : 'please provide number..!'});
        }
        if(!phoneRegex.test(number)){
            return res.status(200).send({error_code : 400, message : 'please provide valid indian formate number..!'});
        }
        if(check_number){
            return res.status(200).send({error_code : 400, message : 'number is already exist, please provide unique number..!'})
        }
        if(!email){
            return res.status(200).send({error_code : 400, message : 'please provide email'});
        }
        if(!emailRegex.test(email)){
            return res.status(200).send({error_code : 400, message : 'please provide valid emailId'});
        }
        if(check_email){
            return res.status(200).send({error_code : 400, message : 'email is already exist , please provide unique emailId'})
        }
        if(!state){
            return res.status(200).send({error_code : 400, message : 'please provide state name..!'});
        }
        if(!city){
            return res.status(200).send({error_code : 400, message : 'please provide city name..!'})
        }
        next()

    }catch(error){
        console.log(error)
        return res.status(500).send({error_code : 500, message : 'error inside checkbody middlware'})
    }
}

module.exports = { 
    checkBody
}