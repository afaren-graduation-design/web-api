'use strict';

var glob = require("glob");
var path = require("path");
var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var yamlConfig = require('node-yaml-config');

var config = yamlConfig.load(__dirname + '../../config/config.yml');
mongoose.connect(config.database);
var db = mongoose.connection;

var cachedTestData;

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
  console.log("开始刷数据库");
  var funList = [function(done) {
    done(null, null);
  }];

  data.forEach((item, key) => {
    funList.push(function(data, done) {
      var model = fixtureModelMap[this.name];
      console.log("删除数据:" + this.name + "......");
      model.remove(done);
    }.bind(item));

    funList.push(function(data, done) {
      var records = this.content;
      var model = fixtureModelMap[this.name];
      console.log("更新数据:" + this.name + "......");
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

beforeAll(function(done) {
  glob("spec/support/fixture/*.json", {}, (err, files) => {
    async.map(files, readFileData, function(err, datas) {
      cachedTestData = datas;
      done();
    });
  })
});

// 覆盖所有数据
beforeEach(function(done) {
  refreshMongo(cachedTestData, done);
});
