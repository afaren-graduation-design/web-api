import apiRequest from '../services/api-request';
import MentorService from '../services/mentor-service/MentorService';

const mentorService = new MentorService();

export default class MentorsController {

  search(req, res, next) {
    const email = req.query.email;
    apiRequest.get('users/search', {email: email, privilege: 'MENTOR'}, (err, resp) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(resp.body);
    });
  }

  findMentorOfStudent(req, res, next) {
    const to = req.session.user.id;
    mentorService.findMentorOfStudent({to}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(data);
    });
  }
}
