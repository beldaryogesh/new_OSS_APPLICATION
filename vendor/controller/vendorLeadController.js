const vendorLeadModel = require("../models/vendorLeadModel");
const userModel = require("../../User/models/userModel");
const serviceModel = require("../models/vendorServiceModel");

const createVendorLead = async function (req, res) {
  try {
    console.log("i am vendor lead controller");
    let serviceId = req.params.id;
    let userId = req.userId;
    let user = await userModel.findById(userId);
    let service = await serviceModel.findById(serviceId);
    service.serviceViewdUser.push(userId);
    service.save()
    let obj = {
      vendorId : service.vendorId ? service.vendorId : undefined,
      serviceId: serviceId ? serviceId : undefined,
      userName: user.name ? user.name : undefined,
      address: user.address ? user.address : undefined,
      number: user.number ? user.number : undefined
    };
    
    await vendorLeadModel.create( obj );

    res.status(201).send({ message: "Vendor lead created successfully", obj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating vendor lead" });
  }
};


const VendorLead = require('../models/vendorLeadModel');

// const getTodayLeads = async function (req, res) {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayLeads = await vendorLeadModel.find({ viewedAt: { $gte: today } });
    // if(todayLeads.length == 0){
    //   return res.status(404).send({message : 'no leads available today..!'})
    // }
//     return res.status(200).send({todayLeads : todayLeads});
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({ message: 'Error fetching todays vendor leads' });
//   }
// };


const getTodayLeads = async function (req, res) {
  try {
    const vendorId = req.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLeads = await VendorLead.find({
      vendorId: vendorId,
      viewedAt: { $gte: today },
    });
    if(todayLeads.length == 0){
      return res.status(404).send({message : 'no leads available today..!'})
    }
    res.status(404).send({todayLeads : todayLeads});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching specific vendor leads for today' });
  }
};
const getYesterdayLeads = async function (req, res) {
  try {
    const vendorId = req.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayLeads = await vendorLeadModel.find({ vendorId : vendorId,
      viewedAt: { $gte: yesterday, $lt: today },
    });
    if(yesterdayLeads.length == 0){
      return res.status(404).send({message : 'no yesterday leads available..!'})
    }
    res.status(200).send({yesterdayLeads: yesterdayLeads});
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Error fetching yesterday\'s vendor leads' });
  }
};


const getPreviousLeads = async function (req, res) {
  try {
    const vendorId = req.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const previousLeads = await vendorLeadModel.find({
      vendorId : vendorId,
      viewedAt: { $lt: yesterday },
    });
    if(previousLeads.length == 0){
      return res.status(404).send({message : 'no previous leads available..!'})
    }
    res.status(200).send({previousLeads});
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Error fetching previous vendor leads' });
  }
};


module.exports = {
  createVendorLead,
  getTodayLeads,
  getYesterdayLeads,
  getPreviousLeads
};
