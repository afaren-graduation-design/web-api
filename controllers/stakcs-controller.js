'use strict';
var apiRequest = require('../services/api-request');

function StacksController() {
};

StacksController.prototype.getStacks = (req, res) => {
  apiRequest.get('stacks', (err, data) => {
    if (err) {
      return res.sendStatus(400);
    }
    return res.send(data.body);
  });
};

module.exports = StacksController;
