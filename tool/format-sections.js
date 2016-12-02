function formatSections(sections) {
  var homeworkQuizzes;
  var blankQuizzes;
  var data;
  // var blankIds;
  // var homeworkIds;
  if (sections.length === 1) {
    // homeworkIds = sections[0].quizzes.map((quiz) => {
    //   return quiz.id;
    // });
    homeworkQuizzes = {quizType: 'homeworkQuizzes', quizzes: sections[0].quizzes};
    data = {homeworkQuizzes};
  } else if (sections.length === 2) {
    // blankIds = [sections[0].quizzes.easy, sections[0].quizzes.normal, sections[0].quizzes.hard];
    blankQuizzes = {quizType: 'blankQuizzes', items: sections[0].quizzes};
    // homeworkIds = sections[0].quizzes.map((quiz) => {
    //   return quiz.id;
    // });
    homeworkQuizzes = {quizType: 'homeworkQuizzes', quizzes: sections[1].quizzes};
    data = {blankQuizzes, homeworkQuizzes};
  }
  return data;
}

module.exports = formatSections;
