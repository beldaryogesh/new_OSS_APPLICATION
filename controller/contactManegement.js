const constant = require('../constant/constant');
const Contact = require('../model/contactModel');

const addUserContactUs = async function(req, res){
    try {
        let obj = {
            number : req.body.number,
            address : req.body.address,
            userType : constant.User
        }
        await Contact.create(obj)
        return res.status(200).json({error_code : 200, message : 'contact details added successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add contact us..!'})
    }
}

const getUserContact = async function(req, res){
    try {
        let contact = await Contact.find({});
        let data = []
        let sr = 1
        for(let i=0; i<contact.length; i++){
            if(contact[i].userType == constant.User){
                data.push({
                    SrNo : sr++,
                    MobileNumber : contact[i].number,
                    Addresss : contact[i].address,
                    Status : contact[i].status,
                    contactId : contact[i]._id
                })
            }
        }
        if(data.length == 0){
            return res.status(200).json({error_code : 404, message : 'no contact details exist..!'})
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get contact..!'})
    }
};


const updateContactDetails = async function(req, res){
    try {
        let contactId = req.body.contactId;
        let obj = {
            number : req.body.number ? req.body.number : undefined,
            address : req.body.address ? req.body.address : undefined
        }
        await Contact.findOneAndUpdate({_id : contactId}, {$set : obj}, {new : true});
        return res.status(200).json({error_code : 200, message : 'contact details update successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update contact details..!'})
    }
}

const deleteContactDetails = async function(req, res){
    try {
        let contactId = req.body.contactId;
        let contact = await Contact.findOneAndDelete({_id : contactId});
        if(!contact){
            return res.status(200).json({error_code : 404, message : 'contact details not exist..!'})
        };
        return res.status(200).json({error_code : 200, message : 'contact details delete successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside deleteContactDetails..!'})
    }
};

const addVendorContactUs = async function(req, res){
    try {
        let obj = {
            number : req.body.number,
            address : req.body.address,
            userType : constant.Vendor
        }
        await Contact.create(obj)
        return res.status(200).json({error_code : 200, message : 'contact details added successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add contact us..!'})
    }
}

const getVendorContact = async function(req, res){
    try {
        let contact = await Contact.find({});
        let data = []
        let sr = 1
        for(let i=0; i<contact.length; i++){
            if(contact[i].userType == constant.Vendor){
                data.push({
                    SrNo : sr++,
                    MobileNumber : contact[i].number,
                    Addresss : contact[i].address,
                    Status : contact[i].status,
                    contactId : contact[i]._id
                })
            }
        }
        if(data.length == 0){
            return res.status(200).json({error_code : 404, message : 'no contact details exist..!'})
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get contact..!'})
    }
};

const updateUserContactStatus = async function(req, res){
    try {
        let contactId = req.body.contactId;
        let contact = await Contact.find({});
        for(let i=0; i<contact.length; i++){
            if(contact[i].userType == constant.User){
                contact[i].status = constant.Deactivate
                contact[i].save()
            }
        }
        let obj = {
            status : req.body.status ? req.body.status : undefined
        }
        await Contact.findByIdAndUpdate({_id : contactId}, {$set : obj}, {new : true})
        return res.status(200).json({error_code : 200, message : 'status update successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update contact status..!'})
    }
}

const updateVendorContactStatus = async function(req, res){
    try {
        let contactId = req.body.contactId;
        let contact = await Contact.find({});
        for(let i=0; i<contact.length; i++){
            if(contact[i].userType == constant.Vendor){
                contact[i].status = constant.Deactivate
                contact[i].save()
            }
        }
        let obj = {
            status : req.body.status ? req.body.status : undefined
        }
        await Contact.findByIdAndUpdate({_id : contactId}, {$set : obj}, {new : true})
        return res.status(200).json({error_code : 200, message : 'status update successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update contact status..!'})
    }
};

module.exports = {
    addUserContactUs,
    getUserContact,
    updateContactDetails,
    deleteContactDetails,
    addVendorContactUs,
    getVendorContact,
    updateUserContactStatus,
    updateVendorContactStatus
}