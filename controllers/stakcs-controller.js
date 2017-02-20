'use strict';
var request = require('superagent');
var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');

function StacksController() {
};

StacksController.prototype.getStacks = (req, res, next) => {
  apiRequest.get('stacks', (err, resp) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.OK).send(resp.body);
  });
};

StacksController.prototype.getStack = (req, res, next) => {
  apiRequest.get(`stacks/${req.params.stackId}`, (err, resp) => {
    if (err) {
      return next(err);
    }
    if (resp.statusCode === 404) {
      return res.sendStatus(constant.httpCode.NOT_FOUND);
    }
    return res.status(constant.httpCode.OK).send(resp.body);
  })
};

StacksController.prototype.create = (req, res, next) => {
  const stack = req.body;
  apiRequest.post('stacks', stack, (err, resp) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.CREATED).send(resp.body);
  })
};

module.exports = StacksController;
