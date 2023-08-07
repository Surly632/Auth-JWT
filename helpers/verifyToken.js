const jwt = require('jsonwebtoken');

async function verifytoken(req,res,next) {
    const authHeader = req.headers.token;
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) res.status(403).send({auth:false,message:"invalid Token"});
            req.user=user;
            next();
        })
    }
    else {
         res.status(401).json('You are not authenticated');
    }
}

module.exports={verifytoken};