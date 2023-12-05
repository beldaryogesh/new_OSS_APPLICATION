const Vendorservice = require('../model/vendorServiceModel');
const Vendor = require('../model/authModel');
const constant = require('../constant/constant');

const addService = async function(req, res){
    try {
        let vendorId = req.userId;
        let vendor = await Vendor.findOne({_id : vendorId})
        let obj = {
            bannerImage : vendor.bannerImage,
            companyName : vendor.companyName,
            whereDoYouWork : vendor.whereDoYouWork,
            number : vendor.number,
            serviceImage : vendor.serviceImage,
            serviceType : vendor.serviceType,
            logoImage : vendor.businessProfileImage,
            time : constant.Time,
            vendorId : vendor._id,
            vendorAddress : vendor.address
        }
        if(vendor.location){
            obj['location'] = { 
                type : 'Point',
                coordinates : [vendor.longitude, vendor.latitude],
            };
        }
        
        await Vendorservice.create(obj);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add service..!'})
    }
}


module.exports = {
    addService
}