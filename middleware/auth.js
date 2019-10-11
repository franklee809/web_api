const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    // Get token from users.js 
    const token = req.header('x-auth-token');
    
    //Check token
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'});
    }

    // Verify token 
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        req.user = decoded.user;  // assign value to user
        next();
    }catch(err){
        res.status(401).json({ msg: 'Token is not valid'});
    }

}

