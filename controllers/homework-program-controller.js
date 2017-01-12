import HomeworkProgramService from '../services/homework/homework-program-service';

function HomeworkProgramController() {

};

const homeworkProgramService = new HomeworkProgramService();

HomeworkProgramController.prototype.getHomeworkListByMysql = (req, res, next) => {
  let page = Number(req.query.page) || 1;
  let homeworkName = req.query.homeworkName || '';
  let stackId = req.query.stackId || null;

  homeworkProgramService.getHomeworkListByMysql({homeworkName, stackId}, (err, data) => {
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

