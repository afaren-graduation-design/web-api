var apiRequest = require('../services/api-request');
import HomeworkProgramService from '../services/homework/homework-program-service';

function HomeworkProgramController() {

};

const homeworkProgramService = new HomeworkProgramService();

HomeworkProgramController.prototype.getHomeworkListByMysql = (req, res, next) => {
  let pageCount = Number(req.query.pageCount) || 10;
  let page = Number(req.query.page) || 1;
  let skipCount = pageCount * (page - 1);

  homeworkProgramService.getHomeworkListByMysql({pageCount, skipCount}, (err, data) => {
    if (err) {
      return next(err);
    }
    if (page === data.totalPage) {
      res.status(202).send(data);
    }
    res.status(200).send(data);
  });
};

HomeworkProgramController.prototype.matchHomeworkByMysql = (req, res, next) => {
  let pageCount = Number(req.query.pageCount) || 10;
  let type = req.query.type;
  let page = Number(req.query.page) || 1;
  let name = req.query.name;
  apiRequest.get('homeworkQuizzes', {pageSize: pageCount, page, homeworkName: name, type}, (err, resp) => {
    if (err && !resp) {
      res.sendStatus(404);
      return next(err);
    } else {
      res.send(resp.body.homeworkQuizzes);
    }
  });
};

module.exports = HomeworkProgramController;

