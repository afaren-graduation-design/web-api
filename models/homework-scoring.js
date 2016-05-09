'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeWorkScoringSchema = new Schema({
  userAnswerRepo: String,
  status: { type: String, enum: ['1','2','3','4','5'], default: '3' },
  result: { type: String, default: '排队中,请稍候...' },
  version: String,
  branch: { type: String, defaultsTo: 'master' },
  commitTime: { type: Number, default: new Date().getTime() },
  homeworkDetail: String,
  callbackURL: String
});

module.exports = mongoose.model('homeworkScoring', homeWorkScoringSchema);
