const async = require('async');
const apiRequest = require('../services/api-request');

class UserAuthorityController {
  getUsers(req, res, next) {
    apiRequest.get('/user-authority', (err ,docs) => {
      if(err) {
        return next(err);
      }
      return res.status(200).send(docs);
    });
  }
}

module.exports = UserAuthorityController;