const userModel = require("../../User/models/userModel");
const faqModel = require("../models/faqModel");
const {
  isvalid,
  nameRegex,
  emailRegex,
  usertypeRegex,
} = require("../../validations/validation");

const add_faq = async function (req, res) {
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "please provide name, email and your question in request body",
      });
    }
    let question = await faqModel.find({});
    if (!req.body.question) {
      return res.status(400).send({
        status: false,
        message: "question filed is empty please provide your question",
      });
    }
    for (let i = 0; i < question.length; i++) {
      if (question[i].question == req.body.question) {
        return res.status(400).send({
          message:
            "question is already exist, please provide unique questio..!",
        });
      }
    }

    if (!usertypeRegex.test(req.body.userType)) {
      return res.status(400).send({
        message: `${req.body.userType} not valid user Type...! please only provide customer and vendor userType..!`,
      });
    }
    let obj = {
      userType: req.body.userType,
      question: req.body.question,
    };
    await faqModel.create(obj);
    return res.status(201).send({
      message: "your question added successfully..!",
      question: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const get_costomer_faq = async function (req, res) {
  try {
    let faq = await faqModel.find({});
    let sr = 1;
    let faqs = [];
    for (let i = 0; i < faq.length; i++) {
      if (faq[i].userType == "customer") {
        faqs.push({
          serialNumber: sr++,
          userType: faq[i].userType,
          question: faq[i].question,
          dateAndTime: faq[i].createdAt,
        });
      }
    }
    if (faqs.length == 0) {
      return res.status(400).send({
        message: "no customer faqs exist..!",
      });
    }
    return res.status(200).send(faqs);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
};

const get_vendor_faq = async function (req, res) {
  try {
    let faq = await faqModel.find({});
    let sr = 1;
    let faqs = [];
    for (let i = 0; i < faq.length; i++) {
      if (faq[i].userType == "vendor") {
        faqs.push({
          serialNumber: sr++,
          userType: faq[i].userType,
          question: faq[i].question,
          dateAndTime: faq[i].createdAt,
        });
      }
    }
    if (faqs.length == 0) {
      return res.status(404).send({
        message: "no vendor faqs exist..!",
      });
    }
    return res.status(200).send(faqs);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const update_faq = async function (req, res) {
  try {
    let faqId = req.params.id;
    let faq = await faqModel.findById(faqId);
    if (!faq) {
      return res.status(400).send({
        message: "no question available for this faqId",
      });
    }
    if (!req.body) {
      return res.status(400).send({
        message: "please provide data for update faq..!",
      });
    }
    if (req.body.question != undefined) {
      if (!req.body.question) {
        return res.status(400).send({
          message: "please provide question..!",
        });
      }
    }
    if (req.body.userType != undefined) {
      if (!req.body.userType) {
        return res.status(400).send({
          message: "please provide userType..!",
        });
      }
      if (!usertypeRegex.test(req.body.userType)) {
        return res.status(400).send({
          message: `${req.body.userType} is not valid userType..! please onlu provide customer and vendor userType..!`,
        });
      }
    }
    if (req.body.reply != undefined) {
      if (!req.body.reply) {
        return res.status(400).send({
          message: "please provide reply..!",
        });
      }
    }
    let obj = {
      userType: req.body.userType ? req.body.userType : faq.userType,
      question: req.body.question ? req.body.question : faq.question,
      reply: req.body.reply ? req.body.reply : undefined,
    };
    await faqModel.findByIdAndUpdate(
      { _id: faqId },
      { $set: obj },
      { new: true }
    );
    return res.status(201).send({
      message: "question update successfully..!",
      question: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
};

const delete_faq = async function (req, res) {
  try {
    let faqId = req.params.id;
    let faq = await faqModel.findById(faqId);
    if(!faq){
      return res.status(404).send({
        message : 'faq not present..!'
      })
    }
    await faqModel.deleteOne({ _id: faqId });
    return res.status(200).send({
      message: "question delete successfully..!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const reply_faq = async function (req, res) {
  try {
    let faqId = req.params.id;
    let reply = req.body;
    if (!req.body) {
      return res.status(400).send({
        message: "body is empty",
      });
    }
    let check_faq = await faqModel.findById(faqId);
    if (!check_faq) {
      return res.status(404).send({
        message: "faqId is not present..!",
      });
    }
    if (!reply) {
      return res.status(400).send({
        message: "reply filed is empty..!",
      });
    }
    let obj = {
      userType: req.body.userType ? req.body.userType : check_faq.userType,
      question: req.body.question ? req.body.question : check_faq.question,
      reply: req.body.reply ? req.body.reply : check_faq.reply,
      date: req.body.createdAt ? req.body.createdAt : check_faq.createdAt,
    };
    let faq = await faqModel.findOneAndUpdate(
      { _id: faqId },
      { $set: reply },
      { new: true }
    );
    return res.status(201).send({
      message: "reply added successfully..!",
      data: obj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
};

module.exports = {
  add_faq,
  get_costomer_faq,
  get_vendor_faq,
  update_faq,
  delete_faq,
  reply_faq,
};
