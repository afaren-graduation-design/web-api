'use strict';

var mongoose = require('mongoose');

var mongoStatus = 'unconnected';
var start = function(mongoURL) {
  var conn = mongoose.connection;

  mongoose.connect(mongoURL);

  conn.on('error', function(err) {
    mongoStatus = err;
  });

  conn.on('connected', function() {
    mongoStatus = 'connected';
  });

  conn.on('disconnected', function() {
    mongoStatus = 'disconnected';
  });
};

function status() {
  return {
    mongodb: mongoStatus
  };
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    process.exit(0);
  });
});

process.on('uncaughtException', function(err) {
  mongoStatus = err;
});

module.exports = {
  start: start,
  status: status
};
