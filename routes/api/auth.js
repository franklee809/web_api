const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt =require('bcrypt');

// @route       GET api/auth
// @desc        Test 
// @access      Public 

router.get('/',auth,async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).semd('Server Error');
    }
});

// @route       POST api/auth
// @desc        Authenticate user & get token (Register)
// @access      Public 
router.post('/',[
    // Middleware start here
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()

    ],async (req,res) => {
        // validate all arguments
        const errors = validationResult(req); // get middleware result
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {email,password} = req.body; 
        
        // Check if user exists
        try{
            let user = await User.findOne({email}); // get from database

            if(!user){
                res.status(400).json({ errors:[{msg: 'Invalid Credentials'}]});
            }

            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(400).json({errors:[{msg: 'Invalid Credentials'}]});
            }

            //Assigning the token
            const payload = {
                user:{
                    id: user.id
                }
            };

            jwt.sign(payload, 
                config.get('jwtSecret'),        // default.json
                {expiresIn: 360000},            // token expired in ...
                (err,token)=>{              
                    if(err) throw err;
                    res.json({token});
                })
                

        }catch(err){
            console.log(err.message);
            res.status(500).send('Server Error');
        }

});
module.exports = router;