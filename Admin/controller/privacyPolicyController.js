const privacyPolicyModel = require('../models/privacypolicyModel');

const add_privacy_policy = async function (req, res) {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "please provide data for add privacy and policy..!",
      });
    }
    if (!req.body.privacyPolicy) {
      return res.status(400).send({
        message: "please provide privacy and policy..!",
      });
    }
    let privacyPolicy = await privacyPolicyModel.find({});
   if(privacyPolicy.length != 0){
    return res.status(400).send({
        message : 'privacy policy are already exist..!'
    })
   }
   let obj = {
    privacyPolicy : req.body.privacyPolicy ? req.body.privacyPolicy : undefined
   }
    await privacyPolicyModel.create(obj);
    return res.status(201).send({
      message: "privacy and policy added successfully..!",
      privacy_policy : obj
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: error,
    });
  }
};

const update_privacy_policy = async function (req, res) {
  try {
    let id = req.params.id;
    if(req.body.privacyPolicy != undefined){
    if(!req.body.privacyPolicy){
        return res.status(400).send({
            message : 'please provide privacy and policy for update..!'
        })
    }
}
    let obj  = {
        privacyPolicy : req.body.privacyPolicy ? req.body.privacyPolicy : undefined
    }
    await privacyPolicyModel.findByIdAndUpdate(
      { _id: id },
      { $set: obj },
      { new: true }
    );
    return res.status(201).send({
      message: "privacy and policy update successfully..!",
      privacy_policy : obj
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
};

module.exports = {
  add_privacy_policy,
  update_privacy_policy,
};
