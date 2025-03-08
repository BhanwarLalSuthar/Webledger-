const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },  
    googleId: { type: String, unique: true, sparse: true  }, 
  }, { timestamps: true , versionKey: false});
  
  module.exports = mongoose.model('User', UserSchema);