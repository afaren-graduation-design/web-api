'use strict';

var apiRequest = require('../services/api-request');
var PaperService = require('../services/paper-service');

function ProgramPaperController() {

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

ProgramPaperController.prototype.retrievePaper = (req, res) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var userId = req.session.user.id;
  // fixme
  var paperUri = `programs/${programId}/papers/${paperId}`;
  apiRequest.get(paperUri, (err, resp) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send({
      data: resp.body
    });
  });
  const paperService = new PaperService();
  paperService.retrieve({programId, paperId, userId}, (err, data) => {
    if (err) {
      throw err;
    }
    res.sendStatus(201);
  });
};

module.exports = ProgramPaperController;
