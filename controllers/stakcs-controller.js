'use strict';
var apiRequest = require('../services/api-request');

function StacksController() {
};

StacksController.prototype.getStacks = (req, res) => {
  apiRequest.get('stacks', (err, resp) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send(resp.body);
  });
};

StacksController.prototype.getStack = (req, res) => {
  apiRequest.get(`stacks/${req.params.stackId}`, (err, resp) => {
    if (err) {
      return res.sendStatus(404);
    }
    return res.send(resp.body);
  })
};

StacksController.prototype.create = (req, res) => {
  const stack = req.body;
  apiRequest.post('stacks', stack, (err, resp) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send(resp.body);
  })
};

module.exports = StacksController;
