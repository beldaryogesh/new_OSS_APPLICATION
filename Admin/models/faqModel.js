const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  }, 
  email: {
    type: String,
    require: true,
    trim: true,
  },
  userType: {
    type: String,
    enum: ['vendor', 'customer' ],
    default : 'customer'
  },
  question : {
    type : String, 
    require : true,
    trim : true
  },
  action : {
    type : String,
    trim : true
  },
  reply : {
    type : String,
    require : true
  }

},{ timestamps: true });

module.exports = mongoose.model('Faq', faqSchema)
