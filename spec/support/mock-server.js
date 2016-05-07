var shelljs = require('shelljs');
var colors = require('colors');

var stdout;

function startServer(config, done) {
  var checkCommand = "lsof -t -i:12306 | wc -l";
  isMockServerStarted = parseInt(shelljs.exec(checkCommand).output.trim()) > 0;
  if(!isMockServerStarted) {
    console.log("Mock Server Was Stopped, Please Run: npm run mock-server".underline.red);
    done(new Error("Mock Server Was Stopped"));
  } else {
    done();
  }
}

function stopServer(done) {
  done();
}

module.exports = {
  start: startServer,
  stop: stopServer
};
