import HomeworkProgramService from '../services/homework/homework-program-service';

function HomeworkProgramController() {

};

const homeworkProgramService = new HomeworkProgramService();

HomeworkProgramController.prototype.getHomeworkListByMysql = (req, res, next) => {
  let page = Number(req.query.page) || 1;
  let homeworkName = req.query.homeworkName || '';
  let type = req.query.type === '全部' ? {} : req.query.type || {};

  homeworkProgramService.getHomeworkListByMysql({homeworkName, type}, (err, data) => {
    if (err) {
      return next(err);
    }
    if (page === data.totalPage) {
      res.status(202).send(data);
    }
    res.status(200).send(data);
  });
};

module.exports = HomeworkProgramController;

