const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema({
    privacyPolicy : {
        type : String,
        trim : true
    }
}) 

module.exports = mongoose.model('Privacy&Policy', privacyPolicySchema);