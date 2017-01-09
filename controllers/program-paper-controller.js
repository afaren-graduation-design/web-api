import apiRequest from '../services/api-request';
import PaperService from '../services/paper-service/index';
const paperService = new PaperService();
class ProgramPaperController {

  getSection(req, res, next) {
    let programId = req.params.programId;
    let paperId = req.params.paperId;
    let userId = req.session.user.id;

    paperService.getSection({programId, _id: paperId, userId}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send({data});
    });
  }

  getPaperList(req, res, next) {
    let programId = req.params.programId;
    apiRequest.get(`programs/${programId}/papers`, (err, resp) => {
      if (err) {
        return next(err);
      }
      return res.send({
        data: resp.body.paperList
      });
    });
  };

  retrievePaper(req, res, next) {
    let programId = req.params.programId;
    let paperId = req.params.paperId;
    let userId = req.session.user.id;
    paperService.retrieve({programId, paperId, userId}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send({data});
    });
  };
}

module.exports = ProgramPaperController;

