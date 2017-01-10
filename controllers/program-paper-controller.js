import apiRequest from '../services/api-request';
import PaperService from '../services/paper-service/index';
import Paper from '../models/paper';
const paperService = new PaperService();
class ProgramPaperController {
  getQuestionIds(req, res, next) {
    let sectionId = req.params.sectionId;
    Paper.findOne({'sections._id': sectionId}).populate('sections.quizzes.quizId')
        .exec((err, doc) => {
          if (err) {
            throw err;
          }
          const section = doc.sections.find((section) => section._id + '' === sectionId);
          switch (section.quizzes[0].quizId.__t) {
            case 'HomeworkQuiz':
              res.send(section.quizzes.map(quiz => {
                return {id: quiz._id, homeworkName: quiz.quizId.homeworkName};
              }));
              break;
            default:
              res.send(section.quizzes.map(quiz => {
                return {id: quiz._id};
              }));
          }
        });
  }

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

