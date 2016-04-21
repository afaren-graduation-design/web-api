'use strict';

var express = require('express');
var router = express.Router();
var adminController = require('../../controllers/admin-controller');

router.get('/users-channel', adminController.getUsersChannel);

module.exports = router;