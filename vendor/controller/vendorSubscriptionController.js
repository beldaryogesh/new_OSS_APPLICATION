const serviceModel = require("../../Admin/models/serviceModel");
const subscriptionModel = require("../../Admin/models/subscription");
const userModel = require("../../User/models/userModel");


const buySubscription = async function (req, res) {
    try {
      let subscriptionId = req.params.id;
      let userId = req.userId;
      const user = await userModel.findById(userId);

      let service = await serviceModel.findOne({serviceName : user.typeOfService })
      if (service) {
        service.usageCount++;
        await service.save();
      }
      const subscription = await subscriptionModel.findById(subscriptionId);
      if (user.subscriptionId) {
        return res
          .status(200)
          .send({error_code : 400, message: "subscription is already present" });
      } else {
        user["subscriptionId"] = subscriptionId;
        subscription.userSubscription.push(user._id);
        let expiryDate = new Date();
        let flag = expiryDate.getMonth() + subscription.subscriptionValidity;
        if (flag > 11) {
          let year = expiryDate.getFullYear() + 1;
          let month = flag - 11 - 1;
          expiryDate.setFullYear(year);
          expiryDate.setMonth(month);
        } else {
          let month = flag - 0;
          expiryDate.setMonth(month);
        }
        user["expiryDate"] = expiryDate;
        user['SubStartDate'] =  new Date()
        user.save();
        subscription.save();
      }
  
      return res
        .status(200)
        .send({ error_code : 200, message: "subscription done successfully" });
    } catch (error) {
      return res.status(500).send({ error_code : 500, message: error.message });
    }
  };

const mySubcription = async function(req, res){
  try{
    let userId = req.userId;
    let user = await userModel.findById(userId);
    if(!user.subscriptionId){
      return res.status(200).send({error_code : 400, message : 'please first take subscription..!'})
    }
    let subscription = await subscriptionModel.findById(user.subscriptionId)

    let obj = {
      userName : user.name,
      subscriptionName : subscription.subscriptionName,
      startDate : user.SubStartDate,
      endDate : user.expiryDate
    }
  return res.status(200).send({error_code : 400, data : obj})

  }catch(error){
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside mySubscription..!'})
  }
}


const renewSubscription = async function(req, res){
  try{
     let userId = req.userId;
     let user = await userModel.findById(userId);
     let subscription = await subscriptionModel.findById(user.subscriptionId);
     let expiryDate = new Date();
     let flag = expiryDate.getMonth() + subscription.subscriptionValidity;
     if (flag > 11) {
       let year = expiryDate.getFullYear() + 1;
       let month = flag - 11 - 1;
       expiryDate.setFullYear(year);
       expiryDate.setMonth(month);
     } else {
       let month = flag - 0;
       expiryDate.setMonth(month);
     }
     user["expiryDate"] = expiryDate;
     user['SubStartDate'] =  new Date()
     user.save();
     subscription.save();
     let obj = {
      userName : user.name,
      subscriptionName : subscription.subscriptionName,
      startDate : user.SubStartDate,
      endDate : user.expiryDate
    }
    return res.status(201).send({error_code : 201,message : 'subscription renew successfully..!', subscription : obj})
  }catch(error){
    console.log(error);
    return res.status(500).send({error_code : 500, message :'error insode renew subscription..!'})
  }
}


module.exports = {
  buySubscription,
  mySubcription,
  renewSubscription
}