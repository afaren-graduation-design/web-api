'use strict';

var apiRequest = require('../services/api-request');
var PaperService = require('../services/paper-service/index');

function ProgramPaperController() {
  this.paperService = new PaperService();
}

ProgramPaperController.prototype.getPaperList = (req, res) => {
  var programId = req.params.programId;
  apiRequest.get(`programs/${programId}/papers`, (err, resp) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send({
      data: resp.body.paperList
    });
  });
};

ProgramPaperController.prototype.retrievePaper = (req, res, next) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var userId = req.session.userId;

  this.paperService.retrieve({programId, paperId, userId}, (err, data) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};

module.exports = ProgramPaperController;
