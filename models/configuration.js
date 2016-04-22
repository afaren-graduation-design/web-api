'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
  registerable: Boolean,
  qaContent: String
});

var Configuration = mongoose.model('Configuration', ConfigurationSchema);
Configuration.findOneAndUpdate({}, {registerable: true, qaContent: ''},
    {upsert: true}, function (err, numberAffected, raw) {
    });

module.exports = Configuration;
