const bannerModel = require("../../Admin/models/bannerModel")


const getBanner = async function(req, res){
    try{
        let banner = await bannerModel.find();
        if (!banner) {
            return res
              .status(200)
              .send({ error_code : 404  , message: "no banner available" });
          }
          let result = [];
          for(let i=0; i<banner.length; i++){
            result.push({
            bannerImage : banner[i].bannerImage,
            bannerId : banner[i]._id
            })
          }
          return res.status(200).send({ error_code : 200, data: result });

    }catch(error){
        console.log(error)
        return res.status(500).send({error_code : 500, message : 'error inside getBanner'})
    }
}

module.exports = {
    getBanner
}