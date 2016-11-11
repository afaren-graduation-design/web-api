var shelljs = require('shelljs');
var colors = require('colors');

var stdout;

function startServer(config, done) {
  var checkCommand = "lsof -t -i:12306 | wc -l";
  console.log(shelljs.exec(checkCommand));
  var result = shelljs.exec(checkCommand).stdout || '';
  isMockServerStarted = parseInt(result.trim()) > 0;
  console.log("isStarted: " + isMockServerStarted);
  if(!isMockServerStarted) {
    console.log("Mock Server Was Stopped, Please Run: npm run mock-server".underline.red);
    done(new Error("Mock Server Was Stopped"));
  } else {
	  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
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
