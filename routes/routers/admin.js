'use strict';

var express = require('express');
var router = express.Router();
var AdminController = require('../../controllers/admin-controller');
var adminController = new AdminController();

//router.get('/users-channel', adminController.getUsersChannel);
router.post('/channel',adminController.addChannel);
router.get('/channel',adminController.getChannel);
router.delete('/channel',adminController.removeChannel);

module.exports = router;