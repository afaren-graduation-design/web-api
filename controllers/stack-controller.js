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
  const definitions = stack.definition.split(' ');
  request
    .get(`https://registry.hub.docker.com/v1/repositories/${definitions[0]}/tags`)
    .end((err, response) => {
      if (response.statusCode !== constant.httpCode.OK) {
        return res.sendStatus(constant.httpCode.BAD_REQUEST);
      }

      const tags = response.body;
      const exit = tags.find((tag) => {
        return tag.name === definitions[1]
      });
      if (definitions.length !== 1 && !exit) {
        return res.sendStatus(constant.httpCode.BAD_REQUEST);
      }

      apiRequest.post('stacks', stack, (err, resp) => {
        if (err) {
          return next(err);
        }
        return res.status(constant.httpCode.CREATED).send(resp.body);
      })
    });

};

module.exports = StacksController;
