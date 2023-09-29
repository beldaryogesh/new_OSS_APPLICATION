const vendorLeadModel = require("../models/vendorLeadModel");
const userModel = require("../../User/models/userModel");
const serviceModel = require("../models/vendorServiceModel");

const createVendorLead = async function (req, res) {
  try {
    console.log("i am vendor lead controller");
    let serviceId = req.body.serviceId;
    let userId = req.userId;
    let user = await userModel.findById(userId);
    let service = await serviceModel.findById(serviceId);
    let obj = {
      vendorId : service.vendorId ? service.vendorId : undefined,
      serviceId: serviceId ? serviceId : undefined,
      userName: user.name ? user.name : undefined,
      number: user.number ? user.number : undefined,
      street: user.street ? user.street : undefined,
      city: user.street ? user.street : undefined,
      street: user.street ? user.street : undefined,
    };
   
    await vendorLeadModel.create( obj );
    service.serviceViewdUser.push(userId);
    service.vendorId
    service.customer.push(userId)
    service.save()
    res.status(201).send({error_code : 200, message: "Vendor lead created successfully", obj });
  } catch (error) {
    console.log(error);
    res.status(500).json({error_code : 500, error_code : 400, message: "Error creating vendor lead" });
  }
};

const getTodayLeads = async function (req, res) {
  try {
    const vendorId = req.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLeads = await vendorLeadModel.find({
      vendorId: vendorId,
      createdAt: { $gte: today },
    });
    let leds = [];
    todayLeads.forEach(led => {
          leds.push({
            name : led.userName,
            number : led.number,
            street : led.street,
            city : led.city,
            state : led.state,
            pincode : led.pincode,
          })
    })
    if(todayLeads.length == 0){
      return res.status(200).send({error_code : 404, message : 'no leads available today..!'})
    }
    return res.status(200).send({todayLeads : leds});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error_code : 500, message: 'Error fetching specific vendor leads for today' });
  }
};


const total_lead = async function(req, res){
  try{
    const vendorId = req.userId;
    const leads = await vendorLeadModel.find({
      vendorId: vendorId,
    });
    let leds = [];
    leads.forEach(led => {
          leds.push({
            name : led.userName,
            number : led.number,
            street : led.street,
            city : led.city,
            state : led.state,
            pincode : led.pincode,
          })
    })
    if(leads.length == 0){
      return res.status(200).send({error_code : 404, leads : 0})
    }
    return res.status(200).send({error_code : 200, leads : leds.length});
  }catch(error){
    console.log(error);
    return res.status(200).json({error_code : 200, message : 'error inside total_lead api in vendor lead controller..!'})
  }
}

const getYesterdayLeads = async function (req, res) {
  try {
    const vendorId = req.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayLeads = await vendorLeadModel.find({ vendorId : vendorId,
      createdAt: { $gte: yesterday, $lt: today },
    });
    let leds = [];
    yesterdayLeads.forEach(led => {
          leds.push({
            name : led.userName,
            number : led.number,
            street : led.street,
            city : led.city,
            state : led.state,
            pincode : led.pincode,
          })
    })
    if(yesterdayLeads.length == 0){
      return res.status(200).send({error_code : 404, message : 'no yesterday leads available..!'})
    }
    res.status(200).send({error_code : 200,yesterdayLeads: leds});
  } catch (error) {
    console.log(error)
    res.status(500).send({ error_code : 500, message: 'Error fetching yesterday\'s vendor leads' });
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
      createdAt: { $lt: yesterday },
    });
    let leds = [];
    previousLeads.forEach(led => {
          leds.push({
            name : led.userName,
            number : led.number,
            street : led.street,
            city : led.city,
            state : led.state,
            pincode : led.pincode,
          })
    })
    if(previousLeads.length == 0){
      return res.status(200).send({error_code : 404, message : 'no previous leads available..!'})
    }
    res.status(200).send({error_code : 200,leds});
  } catch (error) {
    console.log(error)
    res.status(500).send({ error_code : 500, message: 'Error fetching previous vendor leads' });
  }
};

const getLeadsByDate = async function (req, res) {
  try {
    const vendorId = req.userId 
    const date = req.query.date;

    const targetDate = new Date(date);
    const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);

    const leads = await vendorLeadModel.find({
      vendor: vendorId,
      createdAt: { $gte: startDate, $lt: endDate },
    });
    if(leads.length == 0){
      return res.status(200).send({error_code : 404, message : `no leads available for ${date} date`})
    }
    return res.status(200).send({error_code : 200,leads})
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).send({error_code : 500, massage: 'An error occurred while fetching leads.' });
  }
};

module.exports = {
  createVendorLead,
  getTodayLeads,
  getYesterdayLeads,
  getPreviousLeads,
  getLeadsByDate,
  total_lead
};
