const async = require('async');
const apiRequest = require('../services/api-request');
const constant = require("../mixin/constant");

class UserAuthorityController {
  getUsers(req, res, next) {
    apiRequest.get('/user-authority', (err, docs) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(docs);
    });
  }

  updateUsers(req, res, next) {
    const email = req.params.email;
    const userInfo = req.body;
    apiRequest.put(`user-authority/${email}`, userInfo, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }
}

module.exports = UserAuthorityController;