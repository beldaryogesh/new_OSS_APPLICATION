const adminModel = require("../models/adminModel");
const bannerModel = require("../models/bannerModel");
const userModel = require("../models/userModel");
const {
  isValidRequestBody,
  isvalid,
  nameRegex,
  statusRegex,
} = require("../validations/validation");

const add_banner = async function (req, res) {
  try {
    let adminId = req.userId;
    if (!req.body) {
      return res
        .status(400)
        .send({ status: false, message: "please provide data for add banner" });
    }
    const { name, status , description} = req.body;
    let admin = await userModel.findById(adminId);
    let obj = {}
    obj['adminId'] = adminId;
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "please provide banner name" });
    }
    if (!nameRegex.test(name)) {
      return res.status(400).send({
        status: false,
        message: "banner name should contain alphabets only.",
      });
    }
    obj['name'] = name;
    if (!description) {
      return res
        .status(400)
        .send({ status: false, message: "please provide banner description" });
    }
    obj['description'] = description;

    if (!status) {
      return res
        .status(400)
        .send({ status: false, message: "please provide status" });
    }
    if (!statusRegex.test(status)) {
      return res.status(400).send({
        status: false,
        message: "you can only provide Activated and Deactivated status",
      });
    }
    obj['status'] = status;
    if (!req.file) {
      return res
        .status(400)
        .send({ status: false, message: "image not present" });
    }

    const { filename, path } = req.file;
    obj["image"] = {
      fileName: filename,
      fileAddress: path,
    };

    const savedBanner = await bannerModel.create(obj);
    admin.adminBanners.push(savedBanner._id);
    admin.save();
    res.send({
      status: false,
      message: "banner added successfully",
      data: obj,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const get_banner = async function (req, res) {
  try {
    let banner = await bannerModel.find({});
    if (!banner) {
      return res
        .status(404)
        .send({ status: false, message: "no banner available" });
    }
    let result = [];
    let sr = 1
    for(let i=0; i<banner.length; i++){
      result.push({
      SrNo: sr++,
      BannerName : banner[i].name,
      image : banner[i].image,
      Status : banner[i].status
      })
    }
    return res.status(200).send({ status: false, data: result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const update_banner = async function (req, res) {
  try {
    let bannerId = req.params.id;
    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide data for add banner..!" });
    }
    const { name, status ,description  } = req.body;
    const obj = { };

    let banner = await bannerModel.findById( bannerId );
    if (name != undefined) {
      if (!isvalid(name)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide name..!" });
      }
      if (!nameRegex.test(name)) {
        return res.status(400).send({
          status: false,
          message: "banner name should contain alphabets only..!",
        });
      }
      if(banner.name == name){
        return res.status(400).send({
          message : `${name} is already exist, please provide unique banner name..!`
        })
      }
      obj['name'] = name;
    }
    if (status != status) {
      if (!isvalid(status)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide banner status..!" });
      }
      if (!statusRegex.test(status)) {
        return res.status(400).send({
          status: false,
          message: "you can provide only Activated and Deactivated status..!",
        });
      }
      if(banner.status == status){
        return res.status(400).send({
          message : `${status} is already exist..!`
        })
      }
      obj['status'] = status;
    }
    if(description != undefined){
      if(!description){
        return res.status(400).send({
          message : 'please provide description..!'
        })
      }
    }
    obj['description'] = description;
    if(req.file){
      const {filename, path} = req.file;
      obj['image'] = {
        fileName : filename,
        fileAddress: path
      }
    }
    const savedBanner = await bannerModel.findOneAndUpdate(
      { _id: bannerId },
      { $set: obj },
      { new: true }
    );
    res.send({
      status: false,
      message: "banner added successfully..!",
      data: savedBanner,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const delete_banner = async function (req, res) {
  try {
    let bannerId = req.params.id;
    let adminId = req.userId;
    const banner = await bannerModel.findById(bannerId);
    let admin = await adminModel.findById(adminId);
    let index = 0;
    if (banner.isDeleted == true) {
      return res.status(400).send({
        status: false,
        message: "banner is already deleted",
      });
    }
    await bannerModel.deleteOne(
      { _id: bannerId }
    );
    for (let adminId of admin["adminBanners"]) {
      if (adminId == bannerId) break;
      index++;
    }
    admin["adminBanners"].splice(index, 1);
    admin.save();
    return res
      .status(200)
      .send({ status: false, message: "banner delete successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}; 

module.exports = { add_banner, get_banner, update_banner, delete_banner };
