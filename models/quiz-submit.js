var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSubmitSchema = new Schema({
});

var QuizSubmit = mongoose.model('QuizSubmit', quizSubmitSchema);

var HomeworkQuizSubmit = QuizSubmit.discriminator('homework', new Schema({
  userAnswerRepo: String,
  status: { type: Number, default: 3 },
  result: { type: String, default: '排队中,请稍候...' },
  version: String,
  branch: { type: String, defaultsTo: 'master' },
  startTime: Number,
  commitTime: { type: Number, default: new Date().getTime() / 1000 },
  homeworkDetail: String,
  callbackURL: String
}));

var LogicPuzzleSubmit = QuizSubmit.discriminator('logicPuzzle', new Schema({
  userAnswer: Number
}));

module.exports = {QuizSubmit, HomeworkQuizSubmit, LogicPuzzleSubmit};
