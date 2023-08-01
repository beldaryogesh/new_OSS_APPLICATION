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
          .status(400)
          .send({ status: false, message: "subscription is already present" });
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
        user.save();
        subscription.save();
      }
  
      return res
        .status(200)
        .send({ status: true, message: "subscription done successfully" });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };


module.exports = {
  buySubscription
}