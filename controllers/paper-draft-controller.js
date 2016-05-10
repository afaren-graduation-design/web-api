var PaperDraft = require('../models/paper-draft');
var async = require('async');
var httpStatus = require('../mixin/constant').httpCode;

function PaperDefinitionController() {

}

PaperDefinitionController.prototype.getPaperDefinition = (req, res, next) => {
  async.waterfall([(done)=> {
    PaperDraft.find(done);
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
        paperDrafts: null
      });
    } else {
      res.send(data);
    }
  })
};

PaperDefinitionController.prototype.createPaperDefinition = (req, res, next) => {
  var paperDraftDemo = new PaperDraft(req.body);

  paperDraftDemo.save((err) => {
    if (err) return next(err);
    res.send({paperHash: paperDraftDemo._id});
  });
};

PaperDefinitionController.prototype.insertLogicPuzzleSection = (req, res, next) => {
  var paperHash = req.params.paperHash;
  async.waterfall([(done)=>{

  }, (data, done)=>{

  }], (err, data)=>{

  });
  PaperDraft.findOne({_id: paperHash}, done);
};

module.exports = PaperDefinitionController;