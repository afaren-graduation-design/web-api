'use strict';
import HomeworkQuizzesService from '../services/homework/homework-quizzes-service';

var apiRequest = require('../services/api-request');
var homeworkQuizzesService = new HomeworkQuizzesService();

function HomeworkQuizzesController() {
};

HomeworkQuizzesController.prototype.getOneHomework = (req, res, next) => {
  var id = req.params.id;
  homeworkQuizzesService.getOneHomework({id}, (err, data) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(data);
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
