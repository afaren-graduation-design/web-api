const {Router} = require('express');
const router = Router();

const  UserAuthorityController = require('../../controllers/user-authority-controller');
const  userAuthorityCtrl = new UserAuthorityController();

router.get('/',userAuthorityCtrl.getUsers);
router.put('/:email' , userAuthorityCtrl.updateUsers);
module.exports = router;
