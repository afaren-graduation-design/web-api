'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var closeRegisterSchema = new Schema({
  isCloseRegister: Boolean
});

var closeRegister = mongoose.model('closeRegister', closeRegisterSchema);
closeRegister.findOneAndUpdate({isCloseRegister: false},{isCloseRegister: false},
  {upsert: true},function(err,numberAffected, raw){
  console.log(err, numberAffected, raw);
});

module.exports = closeRegister;