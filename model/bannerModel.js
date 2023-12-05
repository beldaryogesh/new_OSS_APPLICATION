const mongoose = require('mongoose');
const constant = require('../constant/constant');

const bannerSchema = new mongoose.Schema({
  bannerName: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [constant.Active, constant.Deactivate],
    default: constant.Deactivate, 
  },
}, { timestamps: true });


module.exports = mongoose.model('Banner', bannerSchema);