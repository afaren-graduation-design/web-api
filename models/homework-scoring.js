'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var homeWorkScoringSchema = new Schema({
  userId: Number,
  gitRepoUrl: String,
  gitRepoBranch: { type: String, default: "master"},
  message: { type: String, default: '排队中,请稍候...' },
  status: { type: String, enum: ['1','2','3','4','5'], default: '3' }
});

module.exports = mongoose.model('homeworkScoring', homeWorkScoringSchema);
