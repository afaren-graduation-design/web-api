var shelljs = require('shelljs');

var stdout;

function startServer(config, done) {
  var script = "java -jar spec/support/moco-runner-0.10.2-standalone.jar http -p 12306 -g spec/support/paper-api.json -s 9527";
  var child = shelljs.exec(script, {
    async: true,
    silent:true
  });

  stdout = child.stdout
  stdout.on('data', function(data) {
    if(data.indexOf("Server is started") > -1) {
      'function' === typeof done && done();
    }

    if(data.indexOf("ERROR") > -1) {
      'function' === typeof done && done(new Error(data));
    }
  });
}

function stopServer(done) {
  shelljs.exec("java -jar spec/support/moco-runner-0.10.2-standalone.jar shutdown -s 9527", {
    async: true,
    silent:true
  });
  done();
}

module.exports = {
  start: startServer,
  stop: stopServer
};
