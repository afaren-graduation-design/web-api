'use strict';
var Token = require('../models/token');
var constant = require('../mixin/constant');

module.exports = function (req, res, next) {
  if (['/register', '/login'].indexOf(req.url) !== -1) {
    return next();
  }
  const uuid = req.cookies.uuid;

  Token.findOne({uuid}, (err, user)=> {
    console.log(user);
    if (err || !user) {
      res.sendStatus(constant.UNAUTHORIZED);
    } else {
      next();
    }
  })
};
