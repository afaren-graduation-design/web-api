var apiRequest = require('../services/api-request');

function HomeworkProgramController() {

};

HomeworkProgramController.prototype.getHomeworkListByMysql = (req, res) => {
  apiRequest.get('homeworkQuizzes', (err, resp) => {
    if (!err && resp) {
      var homeworkList = resp.body.homeworkQuizzes;
      return res.status(200).send({homeworkList});
    }
    return res.sendStatus(404);
  });
};

HomeworkProgramController.prototype.matchHomeworkByMysql = (req, res) => {
  let name = req.query.name;
  apiRequest.get('homeworkQuizzes', (err, resp) => {
    if (!err && resp) {
      let matchedHomeworks = resp.body.homeworkQuizzes.filter((homework) => {
        return homework.homeworkName === name;
      });
      return res.status(200).send({homeworkList: matchedHomeworks});
    }
    return res.sendStatus(404);
  });
};

module.exports = HomeworkProgramController;

