'use strict';

var express = require('express');
var router = express.Router();

var UsersPapersController = require('../../controllers/users-papers-controller');
var usersPapersController = new UsersPapersController();

router.post('/', usersPapersController.addLink);
router.get('/', usersPapersController.getLinks);
router.delete('/', usersPapersController.removeLink);


module.exports = router;