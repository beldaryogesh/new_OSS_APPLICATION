
const addfaq = async function(req, res, next){
    try{
        if(!req.body.question){
            return res.status(200).json({error_code : 400, message : 'please provide question..!'})
        }
        if(!req.body.answer){
            return res.status(200).json({error_code : 400, message : 'please provide answer..!'})
        }
        next()
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add faq in faq middleware..!'})
    }
}

const update = async function(req, res, next){
    try {
        if(req.body.question != undefined){
            if(!req.body.question){
                return res.status(200).json({error_code : 400, message : 'please provide question..!'})
            } 
        }
        if(req.body.answer != undefined){
            if(!req.body.answer){
                return res.status(200).json({error_code : 400, message : 'please provide answer..!'})
            } 
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update in faq midd..!'})
    }
}

module.exports = {
    addfaq,
    update
}
