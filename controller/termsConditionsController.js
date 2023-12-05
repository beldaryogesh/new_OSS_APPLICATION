const TermsCondition = require('../model/termsConditionModel');


const updateTermsConditionsCon = async function (req, res){
    try {
        let termsConditions = await TermsCondition.findOne({});
        if(req.body == undefined){
            return res.status(200).json({error_code : 400, message : 'empty request body..!'})
        }
        let obj = {
            description : req.body.description ? req.body.description : undefined
        }
        if(!termsConditions){
          let create = await TermsCondition.create(obj);
          return res.status(200).json({error_code : 200, message : 'update successfully..!'})
        }
        else{
            termsConditions.description = req.body.description
            termsConditions.save()
            return res.status(200).json({error_code : 200, message : 'update successfully..!'})
        }
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error_code : 500, message : 'error inside updateTermsConditionsCon api in TermsConditions controller..!' });
    }
}

const getTermsConditions = async function(req, res){
    try{
        let termsCondition = await TermsCondition.findOne({});
        return res.status(200).json({error_code : 200, termsCondition : termsCondition.description})

    }catch(error){
        console.log(error);
        return res.status(500).json({ error_code : 500, message : 'error inside getTermsConditions api in TermsConditions controller..!' });
    }
}
  

module.exports = {
    updateTermsConditionsCon,
    getTermsConditions
}