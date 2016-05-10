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
    console.log('data');
    console.log(data);
    if (err === httpStatus.NOT_FOUND) {
      res.send({
        status: httpStatus.NOT_FOUND,
        paperDefinitions: null
      });
    } else {
      res.send(data);
    }
  })
};

PaperDefinitionController.prototype.createPaperDefinition = (req, res, next) => {
  var paperDefinitionDemo = new PaperDefinition(req.body);

  paperDefinitionDemo.save((err) => {
    if (err) return next(err);
    res.send({paperHash: paperDefinitionDemo._id});
  });
};

module.exports = PaperDefinitionController;