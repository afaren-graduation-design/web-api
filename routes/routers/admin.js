'use strict';

var express = require('express');
var router = express.Router();
var AdminController = require('../../controllers/admin-controller');
var adminController = new AdminController();

router.get('/users-channel', adminController.getUsersChannel);

module.exports = router;