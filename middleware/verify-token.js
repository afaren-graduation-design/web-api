'use strict';
var Token = require('../models/token');
// var constant = require('../mixin/constant');

module.exports = (req, res, next) => {
  if (['/register', '/login'].indexOf(req.url) !== -1) {
    return next();
  }
  const uuid = req.cookies.uuid;

  Token.findOne({uuid}, (err, user) => {
    if (err || !user) {
      res.sendStatus(401);
    } else {
      next();
    }
  });
};
