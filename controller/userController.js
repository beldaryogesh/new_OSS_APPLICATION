const User = require('../model/authModel');
const Banner = require('../model/bannerModel');
const AdminService = require('../model/adminServiceModel');
const Faq = require('../model/faqModel');
const constant = require('../constant/constant');
const TermAndConditon = require('../model/termsConditionModel');
const PrivecyPolicy = require('../model/privecyPolicyModel');
const baseURL = require("../constant/baseURL");
const contactModel = require('../model/contactModel');
const VendorService = require('../model/vendorServiceModel');

const getBanner = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let banner = await Banner.find({})
        if(banner.length == 0){
            return res.status(200).json({error_code : 404, message : 'banner not exist..!'})
        }
        let data = [];
        for(let i = 0; i < banner.length; i++){
            if(banner[i].status == constant.Active){
               data.push({bannerImage : baseUrl + banner[i].bannerImage, bannerId : banner[i]._id});
            }
        }
        return res.status(200).json({error_code : 200, data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside get banner..!'})
    }
}

const homeService = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let service = await AdminService.find({});
        if(service.length == 0){
            return res.status(200).json({error_code : 404, message : 'service image not exist..!'})
        }
        let data = [];
        for(let i = 0; i < service.length; i++){
            data.push({
                serviceImage : baseUrl + service[i].serviceImage,
                serviceName : service[i].serviceName,
                serviceId : service[i]._id
            })
        }
        return res.status(200).json({error_code : 200, data})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside home service..!'})
    }
}

const mostUsedService = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        const service = await AdminService.find().sort({ usageCount: -1 }).limit(10);
        let obj = []
       for(let i=0; i<service.length; i++){
        obj.push({
          serviceName : service[i].serviceName,
          serviceImage : baseUrl + service[i].serviceImage,
          serviceId : service[i]._id
        })
       }
        return res.status(200).send({error_code : 200, message: "most used service", services: obj});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside most used service..!'})
    }
}

const getFaqByUser = async function(req, res){
    try {
        let faq = await Faq.find({});
        let faqs = [];
        for (let i = 0; i < faq.length; i++) {
          if (faq[i].userType == constant.User) {
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
        return res.status(500).json({error_code : 500, message : 'error inside get Faq By User..!'})
    }
}

const termsAndCondition = async function(req, res){
    try {
        let terms = await TermAndConditon.findOne({});
        if(!terms){
            return res.status(200).json({error_code : 404, message : 'Terms and Condition not exist..!'})
        }
        return res.status(200).json({error_code : 200, TermsAndCondition : terms.description})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside terms and conditions..!'})
    }
}

const privacyPolicy = async function(req, res){
    try {
        let privacy = await PrivecyPolicy.findOne({});
        if(!privacy){
            return res.status(200).json({error_code : 404, message : 'privacy policy not exist..!'})
        }
        return res.status(200).json({error_code : 200, privacyPolicy : privacy.description})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside privacy and policy..!'})
    }
};

const userUpdate = async function(req, res){
    try {
        let userId = req.userId;
        let obj = {
            name : req.body.name ? req.body.name : undefined,
            state : req.body.state ? req.body.state : undefined,
            city : req.body.city ? req.body.city : undefined,
            email : req.body.email ? req.body.email : undefined,
            address : req.body.address ? req.body.address : undefined,
            latitude : req.body.latitude ? req.body.latitude : undefined,
            longitude : req.body.longitude ? req.body.longitude : undefined
        };
        if (req.files.length > 0) {
            obj["profileImage"] = "/uploads/" + req.files[0].filename;
        }
        await User.findOneAndUpdate({_id : userId}, {$set : obj}, {new : true});
        return res.status(200).json({error_code : 200, message : 'User update successfully..!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error insid update user..!'})
    }
};

const userProfile = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let userId = req.userId;
        let user = await User.findOne({_id : userId})
        let obj = {
            profileImage : baseUrl + user.profileImage ? baseUrl + user.profileImage : undefined,
            name : user.name ? user.name : undefined,
            number : user.number ? user.number : undefined,
            email : user.email ? user.email : undefined,
            address : user.address ? user.address : undefined,
            state : user.state ? user.state : undefined,
            city : user.city ? user.city : undefined,
            address : user.address ? user.address : undefined,
        }
        return res.status(200).json({error_code : 200, obj})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside user profile..!'})
    }
};

const userContactUs = async function(req, res){
    try {
        let con = await contactModel.find({});
        let obj = {};
        for(let i = 0; i<con.length; i++){
            if(con[i].userType == constant.User){
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

const notification = async function(req, res){
    try {
        let userId = req.userId;
        let user = await User.findOne({_id : userId});
        if(!user){
            return res.status(200).json({error_code : 404, message : 'user not exist..!'})
        }
        if(user.notification.length == 0){
            return res.status(200).json({error_code : 200, message : 'notification not exist..!'})
        }
        return res.status(200).json({error_code : 200, notification : user.notification})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside notification..!'})
    }
}

const removeNotifications = async function (req, res) {
    try {
      const userId = req.userId;
      const notificationId = req.body.notificationId;
  
      const user = await User.findOne({_id : userId});
  
      const notificationIndex = user.notification.findIndex((notification) => notification._id.toString() == notificationId);
  
      if (notificationIndex == -1) {
        return res.status(200).json({ error_code: 404, message: 'Notification not found' });
      } 
      user.notification.splice(notificationIndex, 1);
      await user.save();
  
      return res.status(200).json({ error_code: 200, message: 'Notification removed successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error_code: 500, message: 'Error removing notification' });
    }
};

const searchService = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let userId = req.userId;

        let user = await User.findOne({_id : userId})
        console.log(user)

        const { longitude, latitude, serviceType } = req.body;
        let serviceQuery = {};

        if(!serviceType){
            return res.status(200).json({error_code : 400, message : 'please provide serviceType..!'})
        }
        if (!longitude || !latitude) {
          return res.status(400).json({ error_code: 400, message: 'Missing required parameters.' });
        }
    
        const regexSearch = new RegExp(serviceType, 'i');

        serviceQuery.$or = [
            { companyName: regexSearch },
            { serviceType: regexSearch },
            { whereDoYouWork: regexSearch }
        ];

        let service = await VendorService.find({
            location: {
                $near: {
                    $geometry: {type: 'Point', coordinates: [longitude, latitude]},
                    $maxDistance: 12000
                }
            },
            $or: serviceQuery.$or
        });

        let service2 = await VendorService.find({ whereDoYouWork: constant.whereDoYouWork, $or: serviceQuery.$or}).select('-__v');
        if (service.length == 0 && service2.length == 0) {
          return res.status(200).json({ error_code: 404, message: 'No services found for the specified criteria.' });
        }
        let data = []
        for(let i=0; i<service.length; i++){
            data.push({
                companyName: service[i].companyName ? service[i].companyName : undefined,
                address: service[i].vendorAddress ? service[i].vendorAddress : undefined,
                logoImage: service[i].logoImage ? baseUrl + service[i].logoImage :  baseUrl + '/uploads/' + 'defaultImage.jpeg',
                time : service[i].time,
                serviceId : service[i]._id,
                number : service[i].number,
                vendorId : service[i].vendorId
            })
        };
        for(let i =0; i<service2.length; i++){
            data.push({
                companyName: service2[i].companyName || undefined,
                address: service2[i].vendorAddress || undefined,
                logoImage: baseUrl + service2[i].logoImage ? baseUrl + service2[i].logoImage :  baseUrl + '/uploads/' + 'defaultImage.jpeg',
                time : service2[i].time,
                serviceId : service2[i]._id,
                vendorId : service2[i].vendorId
            })
        };
        
        const existingServiceIds = data.map(service => service.serviceId);

        // Get all services that are not present in the existing data array
        const additionalServices = await VendorService.find({ _id: { $nin: existingServiceIds } });

        // Push additional services into the data array
        additionalServices.forEach(service => {
            data.push({
                companyName: service.companyName || undefined,
                address: service.vendorAddress || undefined,
                logoImage: baseUrl + (service.logoImage ? service.logoImage : '/uploads/defaultImage.jpeg'),
                time: service.time,
                serviceId: service._id,
                vendorId: service.vendorId
            });
        });
      
        for (let i = 0; i < data.length; i++) {
            let vendor = await User.findOne({ _id: data[i].vendorId });
            vendor.leads.unshift({
                time: new Date(),
                serviceType: serviceType ? serviceType : undefined,
                userName: user.name ? user.name : undefined,
                address: user.address ? user.address : undefined,
                number: user.number ? user.number : undefined
            });
            let message = `hello dear ${vendor.name}, you received new Lead please check it `
            const timestamp = new Date();
            vendor.notification.unshift({message : message, time: timestamp });
            vendor.save();
        }
      return res.status(200).json({ error_code: 200, message : 'vendor services..!',  data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside search..!'})
    }
};


// const getVendorServices = async function(req, res){
//     try {
//         let userId = req.userId;
//         let user = await User.findOne({_id : userId})
//         let baseUrl = baseURL.generateBaseUrl(req);
//         let service = await VendorService.find({
//           location: {
//             $near: {
//               $geometry: {
//                 type: 'Point',
//                 coordinates: [user.longitude, user.latitude]
//               },
//               $maxDistance: 12000
//             }
//           },
//           serviceType: req.body.serviceType
//         });
//         let service2 = await VendorService.find({ whereDoYouWork: constant.whereDoYouWork, serviceType: req.body.serviceType }).select('-__v');
//         if (service.length == 0 && service2.length == 0) {
//           return res.status(200).json({ error_code: 404, message: 'No services found for the specified criteria.' });
//         }
//         let data = []
//         for(let i=0; i<service.length; i++){
//             data.push({
//                 companyName: service[i].companyName ? service[i].companyName : undefined,
//                 address: service[i].vendorAddress ? service[i].vendorAddress : undefined,
//                 logoImage: service[i].logoImage ? baseUrl + service[i].logoImage :  baseUrl + '/uploads/' + 'defaultImage.jpeg',
//                 time : service[i].time,
//                 serviceId : service[i]._id,
//                 number : service[i].number,
//                 vendorId : service[i].vendorId
//             })
//         };
//         for(let i =0; i<service2.length; i++){
//             data.push({
//                 companyName: service2[i].companyName || undefined,
//                 address: service2[i].vendorAddress || undefined,
//                 logoImage: service2[i].logoImage ? baseUrl + service2[i].logoImage :  baseUrl + '/uploads/' + 'defaultImage.jpeg',
//                 time : service2[i].time,
//                 number : service[i].number,
//                 serviceId : service2[i]._id,
//                 vendorId : service2[i].vendorId
//             })
//         };
//         for (let i = 0; i < data.length; i++) {
//             let vendor = await User.findOne({ _id: data[i].vendorId });
//             vendor.leads.unshift({
//                 time: new Date(),
//                 serviceType: req.body.serviceType ? req.body.serviceType : undefined,
//                 userName: user.name ? user.name : undefined,
//                 address: user.address ? user.address : undefined,
//                 number: user.number ? user.number : undefined
//             });
//             vendor.save();
//         }
//         return res.status(200).json({ error_code: 200, message : 'vendor services..!',  data });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({error_code : 500, message : 'error inside getVendorServices..!'})
//     }
// };

const getVendorServices = async function(req, res) {
    try {
        let userId = req.userId;
        let user = await User.findOne({_id: userId});
        console.log(user)
        let baseUrl = baseURL.generateBaseUrl(req);
        let service = await VendorService.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [user.longitude, user.latitude]
                    },
                    $maxDistance: 12000
                }
            },
            serviceType: req.body.serviceType
        });

        let service2 = await VendorService.find({
            whereDoYouWork: constant.whereDoYouWork,
            serviceType: req.body.serviceType
        }).select('-__v');
        if (service.length == 0 && service2.length == 0) {
            return res.status(200).json({error_code: 404, message: 'No services found for the specified criteria.'});
        }

        let data = [];

        for (let i = 0; i < service.length; i++) {
            data.push({
                companyName: service[i].companyName ? service[i].companyName : undefined,
                address: service[i].vendorAddress ? service[i].vendorAddress : undefined,
                logoImage: service[i].logoImage ? baseUrl + service[i].logoImage : baseUrl + '/uploads/' + 'defaultImage.jpeg',
                time: service[i].time,
                serviceId: service[i]._id,
                number: service[i].number,
                vendorId: service[i].vendorId
            });
        }

        for (let i = 0; i < service2.length; i++) {
            data.push({
                companyName: service2[i].companyName || undefined,
                address: service2[i].vendorAddress || undefined,
                logoImage: service2[i].logoImage ? baseUrl + service2[i].logoImage : baseUrl + '/uploads/' + 'defaultImage.jpeg',
                time: service2[i].time,
                number: service2[i].number,
                serviceId: service2[i]._id,
                vendorId: service2[i].vendorId
            });
        }

        // Get all service IDs from the existing data array
        const existingServiceIds = data.map(service => service.serviceId);

        // Get all services that are not present in the existing data array
        const additionalServices = await VendorService.find({ _id: { $nin: existingServiceIds } });

        // Push additional services into the data array
        additionalServices.forEach(service => {
            data.push({
                companyName: service.companyName || undefined,
                address: service.vendorAddress || undefined,
                logoImage: baseUrl + (service.logoImage ? service.logoImage : '/uploads/defaultImage.jpeg'),
                time: service.time,
                serviceId: service._id,
                vendorId: service.vendorId
            });
        });

        for (let i = 0; i < data.length; i++) {
            let vendor = await User.findOne({_id: data[i].vendorId});
            vendor.leads.unshift({
                time: new Date(),
                serviceType: req.body.serviceType ? req.body.serviceType : undefined,
                userName: user.name ? user.name : undefined,
                address: user.address ? user.address : undefined,
                number: user.number ? user.number : undefined
            });
            vendor.save();
        }

        return res.status(200).json({error_code: 200, message: 'Vendor services..!', data});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code: 500, message: 'Error inside getVendorServices..!'});
    }
};


const viewMore = async function(req, res){
    try {
        let baseUrl = baseURL.generateBaseUrl(req);
        let userId = req.userId;
        let user = await User.findOne({_id : userId});
        let serviceId = req.body.serviceId;
        let service = await VendorService.findOne({_id : serviceId});
        let data = {
            bannerImage :[],
            companyName : service.companyName || undefined,
            address : service.vendorAddress || undefined,
            time : service.time || undefined,
            number : service.number.toString() || undefined,
            photos : [],
            ImageCount : 0
        }
        if(service.bannerImage.length != 0){
            for(let i =0; i < service.bannerImage.length; i++){
              data.bannerImage.push({
                img : baseUrl + service.bannerImage[i]
              })
            }
        }
        if(service.serviceImage.length != 0){
            for(let i =0; i < service.serviceImage.length; i++){
                data.ImageCount++
              data.photos.push({
                img : baseUrl + service.serviceImage[i]
              })
            }
        }
        // let vendor = await User.findOne({_id : service.vendorId})
        // vendor.views.unshift({
        //     time: new Date(),
        //     userRequirement: vendor.serviceType ? vendor.serviceType : undefined,
        //     userName: user.name ? user.name : undefined,
        //     address: user.address ? user.address : undefined,
        //     number: user.number ? user.number : undefined
        // })
        // vendor.save()
        return res.status(200).json({error_code : 200,message : 'view more services..!', data})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside viewMore..!'})
    }
}; 

module.exports = {
    getBanner,
    homeService,
    mostUsedService,
    getFaqByUser,
    termsAndCondition,
    privacyPolicy,
    userUpdate,
    userProfile,
    userContactUs,
    notification,
    removeNotifications,
    searchService,
    getVendorServices,
    viewMore,
};