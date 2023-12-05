const constant = require('../constant/constant');
const User = require('../model/authModel');
const baseURL = require("../constant/baseURL");

const userList = async function( req, res){
    try {
        let user = await User.find({});
        let data = [];
        let sr = 1;
        for(let i=0; i<user.length; i++){
            if(user[i].userType == constant.User){
                data.push({
                    SrNo : sr++,
                    UserName : user[i].name ? user[i].name : undefined, 
                    Email :  user[i].email ? user[i].email : undefined,
                    Mobile : user[i].number ? user[i].number : undefined,
                    Address : user[i].address ? user[i].address : undefined,
                    userId : user[i]._id ? user[i]._id : undefined
                })
            }
        }
        if(data.length == 0){
            return res.status(200).json({error_code : 404, message : 'no user found..!'})
        }
        return res.status(200).json({error_code : 200, data})  
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside user list..!'})
    }
};

const userUpdate = async function(req, res){
    try {
        let userId = req.body.userId;
        let obj = {
            name : req.body.name ? req.body.name : undefined,
            number : req.body.number ? req.body.number : undefined,
            address : req.body.address ? req.body.address : undefined
        }
        if (req.files.length > 0) {
            obj["profileImage"] = "/uploads/" + req.files[0].filename;
        }
        await User.findOneAndUpdate({_id : userId}, {$set : obj}, {new : true});
        return res.status(200).json({error_code : 200, message : 'update successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside userUpdate..!'})
    }
}

const deleteUser = async function(req, res){
    try {
            let userId = req.body.userId;
            let user = await User.findOneAndDelete({_id : userId})
            if(!user){
                return res.status(200).json({error_code : 404, message : 'user not exist..!'})
            };
            return res.status(200).json({error_code : 200, message : 'user deleted successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside delete user..!'})
    }
}

module.exports = {
    userList,
    deleteUser,
    userUpdate
}