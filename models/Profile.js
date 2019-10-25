const mongoose = require('mongoose');

// Create a Schema
const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    status: {type: String},
})


module.exports = User = mongoose.model('profiles',ProfileSchema,'profiles');

