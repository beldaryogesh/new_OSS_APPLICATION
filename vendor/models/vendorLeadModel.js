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
  address: {
    type: String,
    required: true,
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


