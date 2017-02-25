var express = require('express');
var router = express.Router();

var UserAuthorityController = require('../../controllers/user-authority-controller');
var userAuthorityCtrl = new UserAuthorityController();

router.get('/',userAuthorityCtrl.getUsers);
router.put('/:email' , userAuthorityCtrl.updateUsers);
router.post('/' , userAuthorityCtrl.createUser);

module.exports = router;
