const User = require('../model/authModel');

const profileUpdate = async function(req, res, next){
    try {
      let userId = req.userId;
      const user = await User.findById(userId)
      let message = `hello dear ${user.name}, your profile has been update successfully`
      const timestamp = new Date();
      user.notification.unshift({message : message, time: timestamp })
      user.save()
      next()
    } catch (error) {
      console.log(error)
      return res.status(500).send({error_code : 500, message : 'error inside profile update middlware..!'})
    }
};

const documentUpdate = async function(req, res, next){
  try {
    let userId = req.userId;
    const user = await User.findById(userId)
    let message = `hello dear ${user.name}, your document has been update successfully`
    const timestamp = new Date();
    user.notification.unshift({message : message, time: timestamp })
    user.save()
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).send({error_code : 500, message : 'error inside profile update middlware..!'})
  }
};

const addNotification = async function(req, res){
  try {
      let user = await User.find({});
      for(let i=0; i<user.length; i++){
        let message = `hello dear ${user[i].name}, your profile has been update successfully`
        const timestamp = new Date();
        user[i].notification.unshift({message : message, time : timestamp})
        user[i].save()
      }
      return res.status(200).json({error_code : 200, message : 'notification added successfully..!'})
  } catch (error) {
      console.log(error);
      return res.status(200).json({error_code : 500, message : 'error isndie add notification...!'})
  }
}


module.exports = {
    profileUpdate,
    documentUpdate,
    addNotification
}
