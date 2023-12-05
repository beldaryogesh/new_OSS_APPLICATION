const Vendor = require('../model/authModel');
const Subscription = require('../model/subscriptionModel');
const baseURL = require("../constant/baseURL");
const Faq = require('../model/faqModel');
const { addService } = require('../controller/vendorServiceController');
const constant = require('../constant/constant');

const getSubscriptionPlanByVendor = async function (req, res){
    try {
        let userId = req.userId;
        let vendor = await Vendor.findOne({_id : userId});
        let subscription = await Subscription.find({serviceType : vendor.serviceType});
        if(subscription.length == 0){
            return res.status(200).json({error_code : 404, message : 'no subscription plan available for this type of service..!'})
        }
        let data = [];
        for(let i =0; i<subscription.length; i++){
            if(subscription[i].status == constant.Active){
                data.push({
                    planValidity : subscription[i].planValidity ? subscription[i].planValidity : undefined,
                    Amount : subscription[i].amount ? subscription[i].amount : undefined,
                    Description : subscription[i].description ? subscription[i].description : undefined
                })
            }
        }
        if(data.length == 0){
            return res.status(200).json({error_code : 404, message : 'No Subscription Plan Availabe For This Type Of Service..!'})
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get subscription plan by user..!'})
    }
};

const buySubscription = async function(req, res){
    try {
        // incress monst used service value..!
        await addService(req, res)
        return res.status(200).json({error_code : 200, message : 'done'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside buy subscription..!'})
    }
}

const totalLeads = async function(req, res){
    try {
        let vendorId = req.userId;
        let vendor = await Vendor.findOne({_id : vendorId});
        return res.status(200).json({error_code : 200, totalLeads : vendor.leads.length})  
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside totalLeads..!'})
    }
};

// const totalViwes = async function(req, res){
//     try {
//         let vendorId = req.userId;
//         let vendor = await Vendor.findOne({_id : vendorId});
//         return res.status(200).json({error_code : 200, totalViews : vendor.views.length})  
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({error_code : 500, message : 'error inside totalLeads..!'})
//     }
// }

const todayLeads = async function(req, res){
    try {
        let vendorId = req.userId;
        let User = await Vendor.findOne({_id : vendorId});
        const today = new Date().toISOString().split('T')[0];
        const todayLeads = User.leads.filter((lead) => {
           const leadDate = new Date(lead.time).toISOString().split('T')[0];
           return leadDate === today;
        });
        return res.status(200).json({error_code : 200, todayLeads : todayLeads.length})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside today leads..!'})
    }
};

// const todayViews = async function(req, res){
//     try {
//         let vendorId = req.userId;
//         let User = await Vendor.findOne({_id : vendorId});
//         const today = new Date().toISOString().split('T')[0];
//         const todayViwes = User.views.filter((lead) => {
//            const leadDate = new Date(lead.time).toISOString().split('T')[0];
//            return leadDate === today;
//         });
//         return res.status(200).json({error_code : 200, todayViwes : todayViwes.length})
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({error_code : 500, message : 'error inside today views..!'})
//     }
// }


const getTodayLeads = async function (req, res) {
    try {
      const vendorId = req.userId;
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const todayLeads = await Vendor.findOne({_id: vendorId });
      if(todayLeads.leads.length == 0){
        return res.status(200).json({error_code : 404, message : 'no leads available..!'})
      }
      let leds = [];
      todayLeads.leads.forEach(led => {
        if(led.time > today){
            leds.push({
              name : led.userName,
              number : led.number,
              time : led.time,
              address : led.address,
              leadsId : led._id
            })
        }
      })
      if(leds.length == 0){
        return res.status(200).json({error_code : 200, message : 'no leads available for today..!'})
      }
      return res.status(200).json({todayLeads : leds});
    } catch (error) {
      console.log(error)
      res.status(500).json({ error_code : 500, message: 'Error fetching specific vendor leads for today' });
    }
};

const getYesterdayLeads = async function (req, res) {
    try {
      const vendorId = req.userId;
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

    
      const todayLeads = await Vendor.findOne({_id: vendorId });
      if(todayLeads.leads.length == 0){
        return res.status(200).json({error_code : 404, message : 'no leads available..!'})
      }
      let leds = [];
      todayLeads.leads.forEach(led => {
        if(led.time > yesterday && led.time < today){
            leds.push({
              name : led.userName,
              number : led.number,
              time : led.time,
              address : led.address,
              leadsId : led._id
            })
        }
      });
      if(leds.length == 0){
        return res.status(200).json({error_code : 200, message : 'no leads available for Yesterday..!'})
      }
      return res.status(200).json({todayLeads : leds});
    } catch (error) {
      console.log(error)
      res.status(500).json({ error_code : 500, message: 'Error fetching specific vendor leads for today' });
    }
};



const getPreviousLeads = async function (req, res) {
    try {
        const vendorId = req.userId;

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
        vendor.leads.forEach((lead) => {
            if (new Date(lead.time).getTime() < today.getTime()) {
                previousLeads.push({
                    name: lead.userName,
                    number: lead.number,
                    time: lead.time,
                    address: lead.address,
                    leadsId : lead._id
                });
            }
        });

        if (previousLeads.length === 0) {
            return res.status(200).json({ error_code: 200, message: 'No previous leads available.' });
        };
        return res.status(200).json({error_code : 200, previousLeads });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error_code: 500, message: 'Error fetching specific vendor leads for today' });
    }
};

const getLeadsByDate = async function (req, res) {
    try {
      const vendorId = req.userId 
      const date = req.body.date;
  
      const targetDate = new Date(date);
      const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
      const getLeadsByDate = await Vendor.findOne({_id: vendorId });
      if(getLeadsByDate.leads.length == 0){
        return res.status(200).json({error_code : 404, message : 'no leads exist..!'})
      }
      let leds = [];
      getLeadsByDate.leads.forEach(led => {
        if(led.time > startDate && led.time < endDate){
            leds.push({
              name : led.userName,
              number : led.number,
              time : led.time,
              address : led.address,
              leadsId : led._id
            })
        }
      });
      if(leds.length == 0){
        return res.status(200).send({error_code : 404, message : `no leads available for ${date} date`})
      }
      return res.status(200).send({error_code : 200,leds})
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).send({error_code : 500, massage: 'An error occurred while fetching leads.' });
    }
};

const leadsViewMore = async function(req, res){
    try {
        let vendorId = req.userId;
        let leadsId = req.body.leadsId;
        let vendor = await Vendor.findOne({_id : vendorId});
        for(let i=0; i<vendor.leads.length; i++){
            if(vendor.leads[i]._id == leadsId){
                return res.status(200).json({
                    error_code : 200, 
                    name : vendor.leads[i].userName,
                    number : vendor.leads[i].number,
                    time : vendor.leads[i].time,
                    address : vendor.leads[i].address,
                    userRequirement : vendor.serviceType
                })
            }
        }     
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside leadsViewMore..!'})
    }
};


const getVendorProfile = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let vendorId = req.userId;
        let vendor = await Vendor.findOne({_id : vendorId});
        let data = {
            ProfileImage : baseUrl + vendor.profileImage,
            CompanyName : vendor.companyName,
            ContactPersonName : vendor.name,
            Number : vendor.number,
            Address : vendor.address,
            State : vendor.state,
            City : vendor.city,
            PerferredService : vendor.serviceType,
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get vendor profile..!'})
    }
};

const updateVendor = async function(req, res){
    try {
        let vendorId = req.userId;
        let obj = {
            companyName : req.body.companyName ? req.body.companyName : undefined,
            name : req.body.name ? req.body.name : undefined,
            email : req.body.email ? req.body.email : undefined,
            address : req.body.address ? req.body.address : undefined,
            state : req.body.state ? req.body.state : undefined,
            city : req.body.city ? req.body.city : undefined
        };
        if (req.files.length > 0) {
            obj["profileImage"] = "/uploads/" + req.files[0].filename;
        };
        await Vendor.findOneAndUpdate({_id : vendorId}, {$set : obj}, {new : true})
        return res.status(200).json({error_code : 200, message : 'profile update successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update vendor api..!'})
    }
};

const vendorContactUs = async function(req, res){
    try {
        let con = await contactModel.find({});
        let obj = {};
        for(let i = 0; i<con.length; i++){
            if(con[i].userType == constant.Vendor){
                if(con[i].status == constant.Active){
                       obj['number'] = con[i].number,
                       obj['address'] = con[i].address
                }
            }
        };
        return res.status(200).json({error_code : 200, obj})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside userContactUs..!'})
    }
}

const getFaqByVendor = async function(req, res){
    try {
        let faq = await Faq.find({});
        let faqs = [];
        for (let i = 0; i < faq.length; i++) {
          if (faq[i].userType == constant.Vendor) {
            faqs.push({
              question: faq[i].question,
              answer : faq[i].answer,
            });
          }
        } 
        if (faqs.length == 0) {
          return res.status(200).send({error_code : 200,message: "no customer faqs exist..!"});
        }
        return res.status(200).send({error_code : 200,faqs});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside getFaqByVendor..!'})
    }
};

const updateDocuments = async function(req, res){
    try {
        let vendorId = req.userId;
        let vendor = await Vendor.findById(vendorId);
        let obj = { }
        for(let i=0; i<req.files.length; i++){
            console.log(req.files[i])
            if(req.files[i].fieldname == constant.BusinessProfileImage){
                vendor.businessProfileImage = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.AadharCard){
                vendor.aadharCard = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.PanCard){
                vendor.panCard = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.AddressProof){
                vendor.addressProof = "/uploads/" + req.files[i].filename
            }
            if(req.files[i].fieldname == constant.BannerImage){
                vendor.bannerImage.push("/uploads/" + req.files[i].filename)
            }
            if(req.files[i].fieldname == constant.ServiceImage){
               vendor.serviceImage.push("/uploads/" + req.files[i].filename)
            }
        };

        await vendor.save()
        return res.status(200).json({error_code : 200, message : 'document update successfully..!'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside upload documents..!'})
    }
}



module.exports = {
    getSubscriptionPlanByVendor,
    buySubscription,
    totalLeads,
   // totalViwes,
    todayLeads,
   // todayViews,
   getTodayLeads,
   getYesterdayLeads,
   getPreviousLeads,
   getLeadsByDate,
   leadsViewMore,
   getVendorProfile,
   updateVendor,
   getFaqByVendor,
   updateDocuments,
   vendorContactUs
}