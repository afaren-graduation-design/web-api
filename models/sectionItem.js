var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sectionItemSchema = new Schema({
  startTime: Number,
  endTime: Number
});

sectionItemSchema.statics.findOrCreateLogic = (condition, data, done) => {
  const model = mongoose.model('SectionItem');
  if (typeof data === 'function') {
    done = data;
    data = condition;
  }
  condition.__t = 'LogicPuzzle';
  model.findOne(condition, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      return done(null, doc);
    }
    var LogicPuzzle = new PaperLogicPuzzle(data);
    LogicPuzzle.save(done);
  });
};

sectionItemSchema.statics.findOrCreateHomework = (condition, data, done) => {
  const model = mongoose.model('SectionItem');
  if (typeof data === 'function') {
    done = data;
    data = condition;
  }
  condition.__t = 'HomeworkQuiz';
  model.findOne(condition, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      return done(null, doc);
    }
    // model.create(data, done);
    var HomeworkQuiz = new PaperHomeworkQuiz(data);
    HomeworkQuiz.save(done);
  });
};

var SectionItem = mongoose.model('SectionItem', sectionItemSchema);

var PaperLogicPuzzle = SectionItem.discriminator('LogicPuzzle', new Schema({
  question: String,
  description: String,
  id: Number,
  chartPath: String,
  initializedBox: String,
  submits: {
    type: [String],
    default: []
  }
}));

var PaperHomeworkQuiz = SectionItem.discriminator('HomeworkQuiz', new Schema({
  homeworkName: String,
  evaluateScript: String,
  templateRepository: String,
  createTime: Number,
  description: String,
  id: Number,
  type: String,
  uri: String,
  submits: {
    type: [String],
    default: []
  }
}));

module.exports = {SectionItem, PaperLogicPuzzle, PaperHomeworkQuiz};
