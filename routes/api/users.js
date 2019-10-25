const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route       POST api/users
// @desc        Test route 
// @access      Public 

router.post('/',[
    // Middleware start here
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})

    ],async (req,res) => {
        // validate all arguments
        const errors = validationResult(req); // get middleware result
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {name,email,password} = req.body; 
        
        // Check if user exists
        try{
            let user = await User.findOne({email});

            if(user){
                res.status(400).json({ errors:[{msg: 'User already exists'}]});
            }

            const avatar = gravatar.url(email,{
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            // encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password =  await bcrypt.hash(password, salt);

            await user.save();

            // create user token
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