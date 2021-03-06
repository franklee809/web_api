const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator/check');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
// @route       GET api/profile/me
// @desc        Get current user profile
// @access      Private 

router.get('/me',auth, async (req,res) => {
    try{
        // Find user id
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar'])   

        if(! profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       GET api/profile
// @desc        Create or update user profile
// @access      Private 

router.post('/',[auth, [ check('status','Status is required').not().isEmpty()]],
    async (req,res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {status} = req.body;

        // Build profile object
        const profileFields = {}; 
        profileFields.user = req.user.id;
        if(status) profileFields.status = status;

        try{
            let profile = await Profile.findOne({user: req.user.id});
            
            if(profile){
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id},
                    {$set: profileFields},
                    {new:true}
                    );
                return res.json(profile);
            }
            
            //Create
            profile = new Profile(profileFields);

            await profile.save();

            res.json(profile);
        }catch(err){
            console.error(err.message);
            res.status(500).send('Server Error'+"\n"+err.message);
        }
    }

)

// @route       GET api/profile/user/:user_id
// @desc        Get profile by user ID 
// @access      Public 

router.post('/', async(req,res) =>{
    try{
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);

        if(!profile) return res.status(400).json({msg: 'There is no profile for this user'});
        res.json(profile)
    }catch(err){
        console.error(err.message);
         if(err.kind == 'ObjectId'){
             return res.statius(400).json({msg: 'Profile not found'});
         }
         res.status(500).send('Server Error');
    }
})

module.exports = router; 