'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userChannelSchema = new Schema({
  userId: Number,
  channelId: String
});

module.exports = mongoose.model('userChannel',userChannelSchema);