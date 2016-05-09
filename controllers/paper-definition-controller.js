var PaperDefinition = require('../models/paper-definition');
var async = require('async');
var httpStatus = require('../mixin/constant').httpCode;

function PaperDefinitionController() {

}

PaperDefinitionController.prototype.getPaperDefinition = (req, res, next) => {
  async.waterfall([(done)=> {
    PaperDefinition.find(done);
  }, (data, done)=> {
    if (!data) {
      var error = httpStatus.NOT_FOUND;
      done(error, null);
    } else {
      done(null, data);
    }
  }], (err, data)=> {
    if (err === httpStatus.NOT_FOUND) {
      res.send({
        status: httpStatus.NOT_FOUND,
        paperDefinitions: null
      });
    } else {
      res.send(data)
    }
  })
};

module.exports = PaperDefinitionController;