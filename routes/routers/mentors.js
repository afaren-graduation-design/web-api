import {Router} from 'express';

import MentorsController from '../../controllers/mentors-controller';

const mentorsController = new MentorsController();
const router = Router();

router.get('/', mentorsController.search);
router.get('/search', mentorsController.findMentorOfStudent);

module.exports = router;
