'use strict';

require('newrelic');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var route = require('./routes/route');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionCheck = require('./middleware/session-check');
var util = require('util');
var mongoConn = require('./services/mongo-conn');
var MongoStore = require('connect-mongo')(session);
var constant = require('./mixin/constant');
var yamlConfig = require('node-yaml-config');

var captcha = require('./middleware/captcha');
var config = yamlConfig.load(__dirname + '/config/config.yml');

var env = ['production', 'test', 'staging', 'integration'].indexOf(process.env.NODE_ENV) < 0 ? 'development' : process.env.NODE_ENV;


app.use(cookieParser());
app.use(session({
  secret: 'RECRUITING_SYSTEM', resave: false, saveUninitialized: false,
  store: new MongoStore({
    url: config.database,
    ttl: config.sessionTtl
  })
}));


app.use(bodyParser.urlencoded({
  extended: false
}));

var params = {
  "url": "/captcha.jpg",
  "color": "#ffffff",
  "background": "#000000",
  "lineWidth": 1,
  "fontSize": 25,
  "codeLength": 4,
  "canvasWidth": 72,
  "canvasHeight": 34
};

app.use(captcha(params));

app.use(bodyParser.json());

app.use(sessionCheck);

route.setRoutes(app);

app.use(function (req, res, next) {
  res.status(404).send("Not Found!");
});

app.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err.stack);
  }
});

app.listen(config.port, function () {
  console.log('Current environment is: ' + env);
  console.log('App listening at http://localhost:' + config.port);
  mongoConn.start(config.database);
});

module.exports = app;
