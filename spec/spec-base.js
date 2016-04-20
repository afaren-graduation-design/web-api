'use strict';

var glob = require("glob");
var path = require("path");
var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var yamlConfig = require('node-yaml-config');
var session = require('supertest-session');

var mockServer = require('./support/mock-server');
var app = require('../app');

global.testSession = session(app);

var cachedTestData = [];

var fixtureModelMap = {
  "user-homework-quizzes": require("../models/user-homework-quizzes"),
  "group": require("../models/group")
}

function readFileData(file, callBack) {
  fs.readFile(file, 'utf8', function(err, content) {
    callBack(err, {
      name: path.basename(file, '.json'),
      content: JSON.parse(content)
    })
  });
}

function refreshMongo(data, callBack) {
  console.log("Refreshing mongo");
  var funList = [function(done) {
    done(null, null);
  }];
console.log(data);
  data.forEach((item, key) => {
    funList.push(function(data, done) {
      var model = fixtureModelMap[this.name];
      console.log("Remove data:" + this.name + "......");
      model.remove(done);
    }.bind(item));

    funList.push(function(data, done) {
      var records = this.content;
      var model = fixtureModelMap[this.name];
      console.log("Rewrite data:" + this.name + "......");
      model.create(records, done);
    }.bind(item));
  });

  async.waterfall(funList, function(err, data) {
    if(err) {
      console.log(err.stack);
    }
    callBack();
  })
}

function startServer(done) {
  console.log("Starting mock server");
  mockServer.start({}, (err) => {
    if(err) {
      console.log(err);
      done(err)
    } else {
      console.log("Mock server started");
      done(null, null)

    }
  })
}

function login(data, done) {

  console.log("Login as normal user");
  testSession.post('/login')
      .set('Content-Type', 'application/json')
      .send({
        account: 'test@163.com',
        password: '12345678'
      })
      .expect(200)
      .end(function(err, data) {
        // console.log(err);
        console.log("User logged");
        done(null, null)
      });
}

function cacheMongoData(data, done) {
  console.log(__dirname);
  console.log("Loading fixtrue data");
  glob(__dirname + "/support/fixture/*.json", {}, (err, files) => {
    async.map(files, readFileData, function(err, datas) {
      cachedTestData = datas;
      console.log("Fixtrue data was loaded");
      done();
    });
  })
}



beforeAll(function(done) {
  async.waterfall([
    startServer,
    login,
    cacheMongoData
  ], function(err, data) {
    if(err) {return done.fail(err)}
    done();
  })
});

afterAll(function(done) {
  mockServer.stop(done);
})

beforeEach(function(done) {
  refreshMongo(cachedTestData, done);
});
