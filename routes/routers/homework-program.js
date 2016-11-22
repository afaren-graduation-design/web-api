var express = require('express');
var multer = require('multer');

var router = express.Router();
console.log('HomeworkProgramController');
var HomeworkProgramController = require('../../controllers/homework-program-controller');
var homeworkProgramController = new HomeworkProgramController();

router.get('/search', homeworkProgramController.matchHomework);
router.get('/', homeworkProgramController.getHomeworkList);
router.put('/:homeworkId', homeworkProgramController.updateHomework);
router.get('/:homeworkId', homeworkProgramController.getOneHomework);
router.delete('/:homeworkId', homeworkProgramController.deleteHomework);
router.post('/', homeworkProgramController.insertHomework);
router.delete('/', homeworkProgramController.deleteBatch);

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + Math.random().toString().slice(2, 8));
  }
});

var upload = multer({ storage: storage });

router.post('/:homeworkId/evaluateScript', upload.single('script'), homeworkProgramController.insertEvaluateScript);

module.exports = router;
