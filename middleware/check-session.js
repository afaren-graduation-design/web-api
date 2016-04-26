'use strict';

var getJumpControl = require('../mixin/jump-control');

function pathControl(url, session) {

  var target = {};
  var needRedirect = false;
  var jumpControl = getJumpControl(session);

  jumpControl.forEach((item) => {

    if (-1 < item.originPath.indexOf(url) && item.condition) {
      target = item;
      needRedirect = true;
      return;
    }
  });

  return {
    needRedirect: needRedirect,
    status: target.status
  };
}

module.exports = function (req, res, next) {

  var target = pathControl(req.url, req.session);

  if (target.needRedirect) {
    res.sendStatus(target.status);
  } else {
    next();
  }

};