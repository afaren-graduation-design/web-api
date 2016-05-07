'use strict';

var express = require('express');
var router = express.Router();

var HomeworkController  = require('../../controllers/homework-controller');
var homeworkScoringController  = require('../../controllers/homework-scoring-controller');
var homeworkController  = new  HomeworkController();
var githubReq = require('../../services/github-req.js');


router.get('/get-list', homeworkController.getList);
router.get('/quiz',homeworkController.getQuiz);
router.get('/get-branches',githubReq.getBranches);
router.put('/status/:historyId', homeworkController.updateStatus);
router.get('/estimated-time', homeworkController.getEstimatedTime);
router.post('/save',homeworkController.saveGithubUrl);

router.get('/scroing', homeworkScoringController.getScoring);
router.post('/scroing', homeworkScoringController.createScoring);

module.exports = router;
