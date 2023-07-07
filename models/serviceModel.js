const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

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
    image: {
        fileName: {
          type: String,
        },
        fileAddress: {
          type: String,
        },
    },
    adminId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
});

module.exports = mongoose.model("Service", serviceSchema);
