const PrivecyPolicy = require('../model/privecyPolicyModel');

const updatePrivacyPolicy = async function (req, res){
    try {
        let privecypolicy = await PrivecyPolicy.findOne({});
        if(req.body == undefined){
            return res.status(200).json({error_code : 400, message : 'empty request body..!'})
        }
        let obj = {
            description : req.body.description ? req.body.description : undefined
        }
        if(!privecypolicy){
          await PrivecyPolicy.create(obj);
          return res.status(200).json({error_code : 200, message : 'update successfully..!'})
        }
        else{
            privecypolicy.description = req.body.description
            privecypolicy.save()
            return res.status(200).json({error_code : 200, message : 'update successfully..!'})
        }
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error_code : 500, message : 'error inside updatePrivacyPolicy api in PrivecyPolicy controller..!' });
    }
}

const getPrivecyPolicy = async function(req, res){
    try{
        let privecypolicy = await PrivecyPolicy.findOne({});
        return res.status(200).json({error_code : 200, privecypolicy : privecypolicy.description})

    }catch(error){
        console.log(error);
        return res.status(500).json({ error_code : 500, message : 'error inside getPrivecyPolicy api in PrivecyPolicy controller..!' });
    }
}
  

module.exports = {
    updatePrivacyPolicy,
    getPrivecyPolicy
}