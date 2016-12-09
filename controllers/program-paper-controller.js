'use strict';

var apiRequest = require('../services/api-request');

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

ProgramPaperController.prototype.getOnePaper = (req, res) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;

  apiRequest.get(`programs/${programId}/paper/${paperId}`, (err, resp) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send({
      data: resp.body
    });
  });
};

module.exports = ProgramPaperController;
