'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userGroupSchema = new Schema({
  userId: Number,
  groups: [
    {groupId: Number}
  ]
});

module.exports = mongoose.model('userGroup', userGroupSchema);
