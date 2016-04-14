'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersPapersSchema = new Schema({
  phoneNumber: String,
  paperName: String,
  paperId: Number
});

module.exports = mongoose.model('UsersPapers', usersPapersSchema);