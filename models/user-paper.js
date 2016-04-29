'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPaperSchema = new Schema({
  userId: Number,
  papers: [{
    id: Number,
    sections: [{
      id: Number,
      description: String,
      type: String,
      startTime: Number,
      endTime: Number,
      quizzes: [{
        definition_uri: String,
        id: Number,
        item_uri: String
      }]
    }]
  }]
});

module.exports = mongoose.model('UserPaper', userPaperSchema);