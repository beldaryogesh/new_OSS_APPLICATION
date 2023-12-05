
const updateUser = async function(req, res, next){
    try {
        if(req.body.name != undefined){
            if(!req.body.name){
                return res.status(200).json({error_code : 400, message : 'please provide name..!'})
            }
        }
        if(req.body.email != undefined){
            if(!req.body.email){
                return res.status(200).json({error_code : 400, message : 'please provide email..!'})
            }
        }
        if(req.body.state != undefined){
            if(!req.body.state){
                return res.status(200).json({error_code : 400, message : 'please provide state..!'})
            }
        }
        if(req.body.city != undefined){
            if(!req.body.city){
                return res.status(200).json({error_code : 400, message : 'please provide city..!'})
            }
        }
        next()  
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update user midd..!'})
    }
}

module.exports = {
    updateUser
}