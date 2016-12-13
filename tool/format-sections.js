function formatSections(sections) {
  var data;
  data = sections.map((section) => {
    if (section.type === 'homeworkQuiz') {
      return {type: 'homeworkQuizzes', description: section.title, items: section.quizzes};
    } else if (section.type === 'logicQuiz') {
      var items = {
        easyCount: section.quizzes.easy,
        normalCount: section.quizzes.normal,
        hardCount: section.quizzes.hard,
        exampleCount: (section.quizzes.example ? section.quizzes.example : 1)
      }
      return {type: 'blankQuizzes', description: section.title, items};
    }
  });
  return data;
}

module.exports = formatSections;
