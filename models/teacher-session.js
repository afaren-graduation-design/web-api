/**
 * Created by zhangpei on 16/11/3.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacherSession = new Schema({
  userHash:String,
  email:String
});

module.exports = mongoose.model('teacherSession', teacherSession);
