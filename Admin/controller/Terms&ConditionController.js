const TermsConditionModel = require("../models/Terms&ConditionModel");

const add_terms_Condition = async function (req, res) {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "please provide terms and condition..!",
      });
    }
    if (!req.body.TermsCondition) {
      return res.status(400).send({
        message: "please provide terms and condition..!",
      });
    }
    let terms_Condition = await TermsConditionModel.find({});
    if (terms_Condition.length != 0) {
      return res.status(400).send({
        message: "terms and condition is already exist..!",
      });
    }
    await TermsConditionModel.create(req.body);
    return res.status(201).send({
      message: "terms and condition added successfully..!",
    });
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
};

const updateTermsCondition = async function (req, res) {
  try {
    let id = req.params.id;
    if(req.body.TermsCondition != undefined){
    if(!req.body.TermsCondition){
        return res.status(400).send({
            message : 'please provide terms and condition for update..!'
        })
    }
}
    let obj  = {
        TermsCondition : req.body.TermsCondition ? req.body.TermsCondition : undefined
    }
    await TermsConditionModel.findByIdAndUpdate(
      { _id: id },
      { $set: obj },
      { new: true }
    );
    return res.status(201).send({
      message: "terms and condition update successfully..!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
};

module.exports = {
  add_terms_Condition,
  updateTermsCondition,
};
