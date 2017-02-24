'use strict';
const request = require('superagent');
const config = require('config');
const async = require('async');
const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');
const Stack = require('../models/stack');

function StacksController() {
};

StacksController.prototype.getAll = (req, res, next) => {
  async.series({
    items: (done) => {
      Stack.find(done);
    },
    totalCount: (done) => {
      Stack.count(done);
    }
  }, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.status(constant.httpCode.OK).send(result);
  });
};

StacksController.prototype.getOne = (req, res, next) => {
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
  const definitions = stack.definition.split(':');
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
        const callback_url = `${config.get('task.callback_url')}/${doc._id}`;

        request
          .post(config.get('task.buildImage'))
          .type('form')
          .send({image: req.body.definition, callback_url})
          .end(() => {
            console.log('send jenkins success');
          });
      });
    });
};

StacksController.prototype.update = (req, res, next) => {
  const stackId = req.params.stackId;
  const {status}= req.body;
  async.waterfall([
    (done) => {
      let state;
      if (status !== 'SUCCESS') {
        state = constant.addStackStatus.ERROR;
      } else {
        state = constant.addStackStatus.SUCCESS;
      }
      Stack.findByIdAndUpdate(stackId, {status: state}, done);
    },
    (doc, done) => {
      if (status !== 'SUCCESS') {
        return done(true, null);
      }
      const stack = doc.toJSON();
      const data = {
        title: stack.title,
        definition: stack.definition,
        description: stack.description
      };
      apiRequest.post('stacks', data, done);
    }
  ], (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      res.sendStatus(constant.httpCode.NOT_FOUND);
    }
    return res.sendStatus(constant.httpCode.NO_CONTENT);
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
