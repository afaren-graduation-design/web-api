var express = require('express');
var router = express.Router();

var UserAuthorityController = require('../../controllers/user-authority-controller');
var userAuthorityController = new UserAuthorityController();

router.get('/',userAuthorityCtrl.getUsers);
router.put('/:email' , userAuthorityCtrl.updateUsers);
module.exports = router;
