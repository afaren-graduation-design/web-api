function formatSections(sections) {
  var homeworkQuizzes;
  var blankQuizzes;
  var data;
  if (sections.length === 1) {
    homeworkQuizzes = {quizType: 'homeworkQuizzes', quizzes: sections[0].quizzes};
    data = {homeworkQuizzes};
  } else if (sections.length === 2) {
    blankQuizzes = {quizType: 'blankQuizzes', items: sections[0].quizzes};
    homeworkQuizzes = {quizType: 'homeworkQuizzes', quizzes: sections[1].quizzes};
    data = {blankQuizzes, homeworkQuizzes};
  }
  return data;
}

module.exports = formatSections;
