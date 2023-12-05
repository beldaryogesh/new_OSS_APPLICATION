const constant = require('../constant/constant');
const {sectionRegex} = require('../constant/validation');

const checkNotificationBody = async function(req, res, next){
    try {
        let { section, selected, notificationTitle, notificationType, description } = req.body;
        if(!section){
            return res.status(200).json({error_code : 400, message : 'Please Provide Section..!'})
        }
        if(!sectionRegex.test(section)){
            return res.status(200).json({error_code : 400, message : 'Please Provide only Select All, Select All Users, Select All Vendors, Specific Host Section..!'})
        }
        if(section == constant.specificHost){
            if(!selected){
                return res.status(200).json({error_code : 400, message : 'Please Provide selected..!'})
            }
        }
        if(!notificationTitle){
            return res.status(200).json({error_code : 400, message : 'Please Provide Notification Title..!'})
        }
        if(!notificationType){
            return res.status(200).json({error_code : 400, message : 'Please Provide Notification Type..!'})
        }
        if(!description){
            return res.status(200).json({error_code : 400, message : 'Please Provide Description..!'})
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside checkNotificationBody..!'})
    }
}

module.exports = {
    checkNotificationBody
}
