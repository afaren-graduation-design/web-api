var mongoose = require('mongoose');
var yamlConfig = require('node-yaml-config');
var path = require('path');

mongoose.Promise = global.Promise;

const config = yamlConfig.load(path.join(__dirname, '../../config/config.yml'));

before(()=> {
  mongoose.connect(config.database);
});