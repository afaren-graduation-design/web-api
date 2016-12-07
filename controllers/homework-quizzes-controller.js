'use strict';

var apiRequest = require('../services/api-request');

function HomeworkQuizzesController() {

};

HomeworkQuizzesController.prototype.getOneHomework = (req, res) => {
  var id = req.params.id;

  apiRequest.get('homeworkQuizzes/' + id, (err, data) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send({homeworkName: data.body.homeworkItem.homeworkName});
  });
};

module.exports = HomeworkQuizzesController;