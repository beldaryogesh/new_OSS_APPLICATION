const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  serviceImage: {
    fileName: {
      type: String,
    },
    fileAddress: {
      type: String,
    },
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  vendorId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
  },
  serviceId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
  },
  usageCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
