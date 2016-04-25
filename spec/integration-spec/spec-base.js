'use strict';

var glob = require("glob");
var path = require("path");
var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var yamlConfig = require('node-yaml-config');
var session = require('supertest-session');

var mockServer = require('../support/mock-server');
var app = require('../../app');

global.userSession = session(app);
global.adminSession = session(app);

var cachedTestData = [];

var fixtureModelMap = {
  "user-homework-quizzes": require("../../models/user-homework-quizzes"),
  "group": require("../../models/group")
};

function readFileData(file, callBack) {
  fs.readFile(file, 'utf8', function(err, content) {
    callBack(err, {
      name: path.basename(file, '.json'),
      content: JSON.parse(content)
    })
  });
}

function refreshMongo(data, callBack) {
  var funList = [function(done) {
    done(null, null);
  }];

  data.forEach((item, key) => {
    funList.push(function(data, done) {
      var model = fixtureModelMap[this.name];
      model.remove(done);
    }.bind(item));

    funList.push(function(data, done) {
      var records = this.content;
      var model = fixtureModelMap[this.name];
      model.create(records, done);
    }.bind(item));
  });

  async.waterfall(funList, callBack);
}

function startServer(done) {
  mockServer.start({}, (err) => {
    if(err) {
      done(err)
    } else {
      console.log("Mock server started");
      done(null, null)
    }
  })
}

function loginAsUser(data, done) {
  userSession.post('/login')
      .set('Content-Type', 'application/json')
      .send({
        account: 'test@163.com',
        password: '12345678'
      })
      .expect(200)
      .end(function(err, data) {
        done(null, null)
      });
}

function loginAsAdmin(data, done) {
  adminSession.post('/login')
      .set('Content-Type', 'application/json')
      .send({
        account: 'admin@admin.com',
        password: '12345678'
      })
      .expect(200)
      .end(function(err, data) {
        done(null, null)
      });
}

function cacheMongoData(data, done) {
  glob(__dirname + "/support/fixture/*.json", {}, (err, files) => {
    async.map(files, readFileData, function(err, datas) {
      cachedTestData = datas;
      console.log("Fixtrue data was loaded");
      done();
    });
  })
}



before(function(done) {
  async.waterfall([
    startServer,
    loginAsUser,
    loginAsAdmin,
    cacheMongoData
  ], function(err, data) {
    // if(err) {return done.fail(err)}
    done(err);
  })
});

after(function(done) {
  mockServer.stop(done);
});

beforeEach(function(done) {
  refreshMongo(cachedTestData, done);
});
