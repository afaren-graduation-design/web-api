import {Router} from 'express';

import MentorsController from '../../controllers/mentors-controller';

const mentorsController = new MentorsController();
const router = Router();

router.get('/search', mentorsController.search);
router.get('/', mentorsController.findAllMentors);

module.exports = router;
