'use strict';
const request = require('superagent');
const config = require('config');
const async = require('async');
const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');
const Stack = require('../models/stack');

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

      const newStack = Object.assign(stack, {status: constant.addStackStatus.PENDING, message: ''});
      Stack.create(newStack, (err, doc) => {
        if (err) {
          return next(err);
        }
        const callbackUrl = `${config.get('task.callback_url')}/${doc._id}`;
        request
          .post(config.get('task.buildImage'))
          .send({image: req.body.definition, callbackUrl})
          .end(() => {
            console.log('send jenkins success');
          });
      });
    });
};

StacksController.prototype.update = (req, res, next) => {
  const stackId = req.params.stackId;
  const {state, message}= req.body;
  async.waterfall([
    (done) => {
      if (state !== 'SUCCESS') {
        return Stack.findByIdAndUpdate(stackId, {status: constant.addStackStatus.ERROR, message}, done);
      }
      Stack.findById(stackId, done);
    },
    (doc, done) => {
      const stack = doc.toJSON();
      apiRequest.post('stacks', stack, done);
    },
    (data, done) => {
      if (!data) {
        return Stack.findByIdAndUpdate(stackId, {status: constant.addStackStatus.ERROR, message: '创建失败'}, done);
      }
      Stack.findByIdAndUpdate(stackId, {status: constant.addStackStatus.SUCCESS}, done);
    }
  ], (err) => {
    if (err) {
      return next(err);
    }
  });
};

StacksController.prototype.searchStatus = (req, res, next) => {
  const stackId = req.params.stackId;
  Stack.findById(stackId, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.status(constant.httpCode.NOT_FOUND).send({status: 0});
    }
    res.status(constant.httpCode.OK).send({doc: doc.toJSON()});
  })
};

module.exports = StacksController;
