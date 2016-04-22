'use strict';

function jumpControl(data) {
  var isLoged = data.isLoged;
  var isPaperCommited = data.isPaperCommited;
  var isDetailed = data.isDetailed;
  var isAgreed = data.isAgreed;
  var isThirdParty = data.isThirdParty;
  var isAdmin = data.isAdmin;

  return [{
    originPath: [
      'homework.html',
      'logic-puzzle.html',
      'progress.html',
      'start.html',
      'dashboard.html'
    ],
    targetPath: '/join',
    condition: !isLoged
  }, {
    originPath: [
      'logic-puzzle.html',
      'start.html'
    ],
    targetPath: '/dashboard.html',
    condition: isLoged && isPaperCommited && isDetailed
  }, {
    originPath: [
      'homework.html',
      'logic-puzzle.html',
      'progress.html',
      'start.html',
      'dashboard.html'
    ],
    targetPath: '/user-center.html',
    condition: isLoged && !isDetailed
  }, {
    originPath: [
      'homework.html'
    ],
    targetPath: 'dashboard.html',
    condition: !isPaperCommited
  }, {
    originPath: [
      'start.html'
    ],
    targetPath: 'dashboard.html',
    condition: isAgreed
  }, {
    originPath: [
      'user-center.html'
    ],
    targetPath: 'join',
    condition: !(isLoged || isThirdParty)
  }, {
    originPath: [
      'join'
    ],
    targetPath: 'dashboard.html',
    condition: isLoged
  }, {
    originPath: [
      '/admin/registerable',
      '/admin/channel'
    ],
    condition: isAdmin
  }
  ];
}
module.exports = jumpControl;