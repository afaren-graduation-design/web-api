'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersPapersSchema = new Schema({
  phoneNumber: String,
  paperName: String
});

module.exports = mongoose.model('UsersPapers', usersPapersSchema);