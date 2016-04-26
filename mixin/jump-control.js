'use strict';

function jumpControl(session) {

  var isLogined = Boolean(session.user);
  var isAdmin = isLogined ? ( Number(session.user.role) === 9) : false;

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