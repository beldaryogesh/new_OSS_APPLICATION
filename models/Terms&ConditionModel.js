const mongoose = require('mongoose');

const TermsConditionSchema = new mongoose.Schema({
    TermsCondition : {
        type : String,
        trim : true
    }
}) 

module.exports = mongoose.model('Terms&Condition', TermsConditionSchema);