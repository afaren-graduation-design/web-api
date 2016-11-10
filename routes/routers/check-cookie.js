var express = require('express');
var router = express.Router();
var teacherSession = require('../../models/token');

router.get('/', (req, res, next) => {
  const session = req.cookies.teacher;
  console.log(session);
  teacherSession.findOne({userHash: session}, (err, user)=> {
    if (err)
      return next(err);
    console.log(user);
    if (user) {
      return res.sendStatus(200);
    }
    return res.sendStatus(403);
  })
});
module.exports = router;