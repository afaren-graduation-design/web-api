'use strict';

var baseApiRequest = require('./base-api-request.js');
var yamlConfig = require('node-yaml-config');
var apiServer = yamlConfig.load('./config/config.yml').paperApiServer;

var apiRequest = baseApiRequest(apiServer);

module.exports = apiRequest;