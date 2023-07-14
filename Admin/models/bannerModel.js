const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adminId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  image: {
    fileName: {
      type: String,
    },
    fileAddress: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: ['Activated', 'Deactivated'],
    required: true,
  }
});
module.exports = mongoose.model('Banner', bannerSchema);


