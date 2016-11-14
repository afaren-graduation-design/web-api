'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var programPaperSchema = new Schema({
  title: String,
  isDistribution: Boolean,
  programId: Number,
  makerId: Number,
  createTime: Number,
  logicSections: {
    title: String,
    description: String,
    type: String,
    quizzes: {
      easyQuizzes:[
        {
          definition_uri: String,
          items_uri: String
        }
      ],
      normalQuizzes:[
        {
          definition_uri: String,
          items_uri: String
        }
      ],
      hardQuizzes:[
        {
          definition_uri: String,
          items_uri: String
        }
      ]
    }
  },
  homeworkSections: [{
    title: String,
    description: String,
    type: String,
    quizzes: [
      {
        definition_uri: String,
        items_uri: String
      }
    ]
  }]
});

module.exports = mongoose.model('ProgramPaper', programPaperSchema);
