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
    return res.send(data.body.homeworkItem);
  });
};

HomeworkQuizzesController.prototype.getStacks = (req, res) => {
  apiRequest.get('stacks', (err, data) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send(data.body);
  });
};

module.exports = HomeworkQuizzesController;
