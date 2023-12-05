const constant = require('../constant/constant');
const { documentStatusRegex} = require('../constant/validation');

const updateDocumentStatus = async function(req, res, next){
    try {
        let {aadharStatus, panStatus} = req.body;
        if(aadharStatus != undefined){
            if(!aadharStatus){
                return res.status(200).json({error_code : 400, message : 'please provide aadharStatus..!'})
            }
            if(!documentStatusRegex.test(aadharStatus)){
                return res.status(200).json({error_code : 400, message : `please provide only ${constant.Verify} and ${constant.Reject} value`})
            }
        }
        if(panStatus != undefined){
            if(!panStatus){
                return res.status(200).json({error_code : 400, message : 'please provide panStatus..!'})
            }
            if(!documentStatusRegex.test(panStatus)){
                return res.status(200).json({error_code : 400, message : `please provide only ${constant.Verify} and ${constant.Reject} value`})
            }
        }
        next()  
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside updateDocumentStatus middleware..!'})
    }
};

module.exports = {
    updateDocumentStatus
}