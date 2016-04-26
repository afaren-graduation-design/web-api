'use strict';

function jumpControl(session) {

  var isLogined = Boolean(session.user);
  var role = [1, 2, 9];
  var isAdmin = isLogined ? (-1 < role.indexOf(Number(session.user.role))) : false;

  return [{
    originPath: [
      '/reuse/account'
    ],
    condition: !isLogined,
    status: 401
  }, {
    originPath: [
      '/admin/registerable',
      '/admin/channel'
    ],
    condition: isLogined && !isAdmin,
    status: 403
  }];

}
module.exports = jumpControl;