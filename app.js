'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var route = require('./routes/route');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoConn = require('./services/mongo-conn');
var MongoStore = require('connect-mongo')(session);
var yamlConfig = require('node-yaml-config');
var captcha = require('./middleware/captcha');

var path = require('path');
var config = yamlConfig.load(path.join(__dirname, '/config/config.yml'));

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
  'url': '/captcha.jpg',
  'color': '#ffffff',
  'background': '#000000',
  'lineWidth': 1,
  'fontSize': 25,
  'codeLength': 4,
  'canvasWidth': 72,
  'canvasHeight': 34
};

if (env === 'test') {
  params.text = '1234';
}

app.use(captcha(params));

app.use(bodyParser.json());
route.setRoutes(app);

app.use((err, req, res, next) => {
  if (err) {
    return next(err);
  }
  res.status(404).send('Not Found!');
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(err.stack);
  }
});

app.listen(config.port, () => {
  console.log('server started at http://localhost:' + config.port);   // eslint-disable-line no-console
  mongoConn.start(config.database);
  console.log('Current environment is: ' + env); // eslint-disable-line no-console
  console.log('App listening at http://localhost:' + config.port); // eslint-disable-line no-console
});

module.exports = app;
