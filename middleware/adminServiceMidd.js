
const addService = async function(req, res, next){
    try{
        let {serviceName, description} = req.body;
        if(!serviceName){
            return res.status(200).json({error_code : 400, message : 'please provide service name..!'})
        }
        if(!description){
            return res.status(200).json({error_code : 400, message : 'please provide description..!'})
        }
        if(req.files.length == 0){
            return res.status(200).json({error_code : 400, message : 'please provide service image..!'})
        }
        next()
    }catch(error){
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside add service midd in admin service middleware..!'})
    }
}

const update = async function(req, res, next){
    try {
        let {serviceName, description} = req.body;
        if(serviceName != undefined){
            if(!serviceName){
                return res.status(200).json({error_code : 400, message : 'please provide service name..!'})
            }
        }
        if(description != undefined){
            if(!description){
                return res.status(200).json({error_code : 400, message : 'please provide description..!'})
            }
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error_code : 500, message : 'error inside update in Admin service controller..!'})
    }
}

module.exports = {
    addService,
    update
}