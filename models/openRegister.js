'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var openRegisterSchema = new Schema({
  isOpenRegister: Boolean
});

var openRegister = mongoose.model('openRegister', openRegisterSchema);
openRegister.findOneAndUpdate({isOpenRegister: false},{isOpenRegister: false},
  {upsert: true},function(err,numberAffected, raw){
  console.log(err, numberAffected, raw);
});

module.exports = openRegister;