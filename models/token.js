/**
 * Created by zhangpei on 16/11/3.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var token = new Schema({
  uuid: String,
  id: String
});

module.exports = mongoose.model('token', token);
