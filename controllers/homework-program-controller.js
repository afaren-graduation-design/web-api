var apiRequest = require('../services/api-request');

function HomeworkProgramController() {

};

HomeworkProgramController.prototype.getHomeworkListByMysql = (req, res) => {
  let pageCount = Number(req.query.pageCount) || 10;
  let page = Number(req.query.page) || 1;
  let skipCount = pageCount * (page - 1);
  apiRequest.get('homeworkQuizzes', (err, resp) => {
    if (!err && resp) {
      let totalPage = Math.ceil(resp.body.homeworkQuizzes.length / pageCount);
      let homeworkList = resp.body.homeworkQuizzes.slice(skipCount, skipCount + pageCount);
      if (page === totalPage) {
        return res.status(202).send({homeworkList, totalPage});
      }
      return res.status(200).send({homeworkList, totalPage});
    }
    return res.sendStatus(404);
  });
};

HomeworkProgramController.prototype.matchHomeworkByMysql = (req, res) => {
  let pageCount = Number(req.query.pageCount) || 10;
  let page = Number(req.query.page) || 1;
  let skipCount = pageCount * (page - 1);
  let name = req.query.name;
  apiRequest.get('homeworkQuizzes', (err, resp) => {
    if (!err && resp) {
      let matchedHomeworks = resp.body.homeworkQuizzes.filter((homework) => {
        return homework.homeworkName === name;
      });
      let totalPage = Math.ceil(matchedHomeworks.length / pageCount);
      let homeworkList = matchedHomeworks.slice(skipCount, skipCount + pageCount);
      if (totalPage === 0 || page === totalPage) {
        return res.status(202).send({homeworkList, totalPage});
      }
      return res.status(200).send({homeworkList, totalPage});
    }
  });
};

module.exports = HomeworkProgramController;

