const constant = require('../constant/constant');
const Vendor = require('../model/authModel');
const baseURL = require("../constant/baseURL");

const getVendorList = async function (req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let vendor = await Vendor.find({});
        let data = [];
        let sr = 1
        for(let i=0; i<vendor.length; i++){
            if(vendor[i].userType == constant.Vendor){
                data.push({
                    SrNo : sr++,
                    Name : vendor[i].name ? vendor[i].name : undefined,
                    MobileNo : vendor[i].number ? vendor[i].number : undefined,
                    EmailID : vendor[i].email ? vendor[i].email : undefined,
                    Address : vendor[i].address ? vendor[i].address : undefined,
                    ProfilePicture : baseUrl + vendor[i].profileImage ? baseUrl + vendor[i].profileImage : undefined,
                    Status : vendor[i].status ? vendor[i].status : undefined,
                    vendorId : vendor[i]._id ? vendor[i]._id : undefined
                })
            }
        }
        if(data.length == 0){
            return res.status(200).json({error_code : 404, message : 'no vendor exist..!'})
        }
        return res.status(200).json({error_code : 500, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get vendor list..!'})
    }
};

const deleteVendor = async function(req, res){
    try {
        let vendorId = req.body.vendorId;
        let vendor = await Vendor.findOneAndDelete({_id : vendorId})
        if(!vendor){
            return res.status(200).json({error_code : 404, message : 'vendor not exist..!'})
        };
        return res.status(200).json({error_code : 200, message : 'vendor deleted successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside delete vendor..!'})
    }
};

const vendorDetails = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let vendorId = req.body.vendorId;
        let vendor = await Vendor.findOne({_id : vendorId});
        let data = {
            ProfileImage : baseUrl + vendor.profileImage ? baseUrl + vendor.profileImage : undefined,
            Name : vendor.name ? vendor.name : undefined,
            EmailID : vendor.email ? vendor.email : undefined,
            Address : vendor.address ? vendor.address : undefined,
            Number : vendor.number ? vendor.number : undefined,
            TotalLeads : vendor.leads.length ? vendor.leads.length : 0,
            ContactView : vendor.leads.length ? vendor.leads.length : 0
        }
        return res.status(200).json({error_code : 200, data})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside vendor details..!'})
    }
};

const getAadharAndPanCard = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let vendorId = req.body.vendorId;
        let vendor = await Vendor.findOne({_id : vendorId});
        if(!vendor){
            return res.status(200).json({error_code : 404, message : 'vendor not found..!'})
        } 
        return res.status(200).json({
            error_code : 200,
            HolderName : vendor.name,
            AadharStatue : vendor.aadharStatus,
            AadharImage : baseUrl + vendor.aadharCard,
            PanStatus : vendor.panStatus,
            PancardImage : baseUrl + vendor.panCard,
            vendorId : vendor.Id
         })       
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 200, message : 'Error inside getAadharAndPanCard..!'})
    }
};

const updateDocumentStatus = async function(req, res){
    try {
        let vendorId = req.body.vendorId;
        let obj = {
            aadharStatus : req.body.aadharStatus ? req.body.aadharStatus : undefined,
            panStatus : req.body.panStatus ? req.body.panStatus : undefined
        }
       await Vendor.findOneAndUpdate({_id : vendorId}, {$set : obj}, {new : true});
        return res.status(200).json({error_code : 200, message : 'status update successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(200).json({error_code : 500, message : 'error inside updateDocumentStatus..!'})
    }
}


const getTodayLeadsByAdmin = async function(req, res){
    try {
        let vendorId = req.body.vendorId;
        const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const todayLeads = await Vendor.findOne({_id: vendorId });
      if(todayLeads.leads.length == 0){
        return res.status(200).json({error_code : 404, message : 'no leads available..!'})
      }
      let leds = [];
      let sr = 1
      todayLeads.leads.forEach(led => {
        if(led.time > today){
            leds.push({
              SrNo : sr++,
              C_Name : led.userName,
              ServiceName : todayLeads.serviceType,
              MobileNumber : led.number,
              time : led.time,
              Address : led.address,
              leadsId : led._id,
              vendorId : todayLeads._id
            })
        }
      })
      if(leds.length == 0){
        return res.status(200).json({error_code : 200, message : 'no leads available for today..!'})
      }
      return res.status(200).json({todayLeads : leds});
    } catch (error) {
        console.log(error);
        return res.status(200).json({error_code : 200, message : 'error inside getTodayLeadsByAdmin..!'})
    }
}

const getPreviousLeadsByAdmin = async function(req, res){
    try {
        let vendorId = req.body.vendorId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const vendor = await Vendor.findOne({ _id: vendorId });

        if (!vendor) {
            return res.status(404).json({ error_code: 404, message: 'Vendor not found' });
        }

        if (vendor.leads.length === 0) {
            return res.status(200).json({ error_code: 404, message: 'No leads available.' });
        }

        let previousLeads = [];
        let sr = 1
        vendor.leads.forEach((lead) => {
            if (new Date(lead.time).getTime() < today.getTime()) {
                previousLeads.push({
                    SrNo : sr++,
                    C_Name : lead.userName,
                    ServiceName : vendor.serviceType,
                    MobileNumber : lead.number,
                    time : lead.time,
                    Address : lead.address,
                    leadsId : lead._id,
                    vendorId : vendor._id
                });
            }
        });

        if (previousLeads.length === 0) {
            return res.status(200).json({ error_code: 200, message: 'No previous leads available.' });
        }

        return res.status(200).json({error_code : 200, previousLeads });
    } catch (error) {
        console.log(error);
        return res.status(200).json({error_code : 200, message : 'error inside getTodayLeadsByAdmin..!'})
    }
};

const deleteLeadByAdmin = async function(req, res){
    try {
        const vendorId = req.body.vendorId;
        const leadId = req.body.leadId;
        const vendor = await Vendor.findOne({_id : vendorId});
    
        const leadIndex = vendor.leads.findIndex((leads) => leads._id.toString() == leadId);
    
        if (leadIndex == -1) {
          return res.status(200).json({ error_code: 404, message: 'leads not found' });
        } 
        vendor.leads.splice(leadIndex, 1);
        await vendor.save();
    
        return res.status(200).json({ error_code: 200, message: 'leads removed successfully' });
        
    } catch (error) {
        console.log(error);
        return res.status(200).json({error_code : 500, message : 'error inside DeleteVendorLeadByAdmin..!'})
    }
}

module.exports = {
    getVendorList,
    deleteVendor,
    vendorDetails,
    getTodayLeadsByAdmin,
    getPreviousLeadsByAdmin,
    deleteLeadByAdmin,
    getAadharAndPanCard,
    updateDocumentStatus
}