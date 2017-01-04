import apiRequest from '../services/api-request';
import PaperService from '../services/paper-service/index';
const paperService = new PaperService();
class ProgramPaperController {
  // constructor() {
  //   this.paperService = new PaperService();
  // };

  getSection(req, res, next) {
    var programId = req.params.programId;
    var paperId = req.params.paperId;
    var userId = req.session.user.id;

    paperService.getSection({programId, paperId, userId}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    });
  }

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
    var userId = req.session.user.id;
    paperService.retrieve({programId, paperId, userId}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send({data});
    });
  };
}

module.exports = ProgramPaperController;

