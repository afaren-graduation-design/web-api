var apiRequest = require('../services/api-request');

function findOne(req, res, next) {
  apiRequest.get("papers/1", function(err, data) {
    if(err) {
      return next(err);
    }
    res.send(data.body);
  })
}

module.exports = {
  findOne: findOne
}