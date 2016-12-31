const apiRequest = require('../services/api-request');
import  PaperService from '../services/paper-service/index';
class ProgramPaperController {
  constructor() {
    this.paperService = new PaperService()
  };

  getPaperList(req, res) {
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

  retrievePaper(req, res, next) {
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
}

module.exports = ProgramPaperController;

