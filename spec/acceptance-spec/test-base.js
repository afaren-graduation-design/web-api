var proxy = require('express-http-proxy');
var request = require('supertest');
var app = require('express')();
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var async = require("async");
var shelljs = require("shelljs");

var serverAddr = "http://192.168.99.100:8080";

app.use(proxy(serverAddr, {
  forwardPath: function(req, res) {
    return '/paper-api' + require('url').parse(req.url).path;
  }
}));

app.listen(5000);

function buildspec(data, done) {
  var method = data.request.method || 'get';
  var postData = data.request.json;
  var queryData = data.request.query;

  request(app)[method](data.request.uri)
    .query(queryData)
    .send(postData)
    .expect(200)
    .expect(function(res) {
      expect(res.body).toEqual(data.response.json);
    })
    .end(function(err, res) {
      if (err) {
        console.log(data.description);
        console.log(err);
        return done.fail(err)
      }
      done();
    });
}

var files = glob.sync(__dirname + "/../support/mock-api/paper-api/**/*.json");

var data = files.map((file)=> {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
});

data = data.reduce((a, b)=> {
  return a.concat(b);
});

//beforeEach(function() {
//  shelljs.exec("cd ../paper-api && ./gradlew flywayclean && cd -", {silent: true});
//  shelljs.exec("cd ../paper-api && ./gradlew flywaymigrate && cd -", {silent: true});
//})

describe("paper-api:", function() {

  data.forEach((specData)=> {
    it(specData.description, function(done) {
      buildspec(this, done);
    }.bind(specData));
  })
});
