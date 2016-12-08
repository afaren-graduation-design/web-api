function formatSections(sections) {
  var homeworkQuizzes;
  var blankQuizzes;
  var data;
  data = sections.map((section) => {
    if (section.type === 'homeworkQuiz') {
      homeworkQuizzes = {quizType: 'homeworkQuizzes', quizzes: section.quizzes};
      return {homeworkQuizzes};
    } else if (section.type === 'logicQuiz') {
      blankQuizzes = {quizType: 'blankQuizzes', items: sections[0].quizzes};
      return {blankQuizzes};
    }
  });
  return data;
}

module.exports = formatSections;
