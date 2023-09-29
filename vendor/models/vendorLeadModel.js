const mongoose = require('mongoose');

const vendorLeadSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  serviceId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'VenderService',
    require : true
  },
  userName: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    trim: true,
  },
  state:{
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
  message : {
    type : String
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
}, {timestamps : true});

module.exports = mongoose.model('VendorLead', vendorLeadSchema);


