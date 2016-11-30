var express = require('express');
var multer = require('multer');

var router = express.Router();
var HomeworkProgramController = require('../../controllers/homework-program-controller');
var homeworkProgramController = new HomeworkProgramController();

router.get('/search', homeworkProgramController.matchHomework);
router.get('/homeworkList', homeworkProgramController.getHomeworkListByMysql);
router.get('/homeworkList/search', homeworkProgramController.matchHomeworkByMysql);
router.get('/', homeworkProgramController.getHomeworkList);
router.delete('/deletion', homeworkProgramController.deleteSomeHomeworks);
router.put('/:homeworkId', homeworkProgramController.updateHomework);
router.get('/:homeworkId', homeworkProgramController.getOneHomework);
router.delete('/:homeworkId', homeworkProgramController.deleteHomework);

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + Math.random().toString().slice(2, 8));
  }
});

var upload = multer({storage: storage});

router.post('/:homeworkId/evaluateScript', upload.single('script'), homeworkProgramController.insertEvaluateScript);
router.post('/', homeworkProgramController.insertHomework);

module.exports = router;
