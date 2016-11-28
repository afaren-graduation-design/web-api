var yamlConfig = require('node-yaml-config');
var mongoose = require('mongoose');
var path = require('path');
var config = yamlConfig.load(path.join(__dirname, '/config/config.yml'));
var mongoTools = require('./spec/support/fixture/mongo-tools');

mongoose.connect(config.database);
mongoTools.refresh(() => {
  mongoose.connection.close(function() {
    process.exit(0);
  });
});
