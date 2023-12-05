const constant = require('../constant/constant');
const Faq = require('../model/faqModel');

const addUserFaq = async function(req, res){
    try {
        let obj = {
            question : req.body.question ? req.body.question : undefined,
            answer : req.body.answer ? req.body.answer : undefined,
            userType : constant.User
        }
        await Faq.create(obj);
        return res.status(200).json({error_code : 200, message : 'faq added successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add user fad'})
    }
}

const getUserFaq = async function (req, res){
    try {
        let faq = await Faq.find({});
        if(faq.length == 0){
            return res.status(200).json({error_code : 404, message : 'no user faq exist..!'})
        }
        let data = [];
        let sr = 1
        for(let i=0; i<faq.length; i++){
            if(faq[i].userType == constant.User){
                data.push({
                    SrNo : sr++,
                    Question : faq[i].question,
                    Answer :faq[i].answer,
                    faqId : faq[i]._id
                })
            }
        }
        if(data.length == 0){
            return res.status(200).json({error_code : 404, message : 'no user faq exist..!'})
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get user faq..!'})
    }
};

const updateFaq = async function(req, res){
    try {
        let faqId = req.body.faqId;
        let obj = {
            question : req.body.question ? req.body.question : undefined,
            answer : req.body.answer ? req.body.answer : undefined,
        }
        await Faq.findOneAndUpdate({_id : faqId}, {$set : obj}, {new : true});
        return res.status(200).json({error_code : 200, message : 'faq update successfully..!'})
    } catch (error) {
        console.log(error);
        return rs.status(500).json({error_code : 500, message : 'error inside update faq..!'})
    }
}

const deleteFaq = async function(req, res){
    try {
        let faqId = req.body.faqId;
        let faq = await Faq.findOneAndDelete({_id : faqId});
        if(!faq){
            return res.status(200).json({error_code : 400, message : 'faq not exist..!'})
        }
        return res.status(200).json({error_code : 200, message : 'faq deleted successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({errro_code : 200, message : 'error inside delete faq..!'})
    }
}


const addVendorFaq = async function(req, res){
    try {
        let obj = {
            question : req.body.question ? req.body.question : undefined,
            answer : req.body.answer ? req.body.answer : undefined,
            userType : constant.Vendor
        }
        await Faq.create(obj);
        return res.status(200).json({error_code : 200, message : 'faq added successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add user fad'})
    }
}

const getVendorFaq = async function (req, res){
    try {
        let faq = await Faq.find({});
        if(faq.length == 0){
            return res.status(200).json({error_code : 404, message : 'no user faq exist..!'})
        }
        let data = [];
        let sr = 1
        for(let i=0; i<faq.length; i++){
            if(faq[i].userType == constant.Vendor){
                data.push({
                    SrNo : sr++,
                    Question : faq[i].question,
                    Answer :faq[i].answer,
                    faqId : faq[i]._id
                })
            }
        }
        if(data.length == 0){
            return res.status(200).json({error_code : 404, message : 'no user faq exist..!'})
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get user faq..!'})
    }
};

module.exports = {
    addUserFaq,
    getUserFaq,
    updateFaq,
    deleteFaq,
    addVendorFaq,
    getVendorFaq
}
