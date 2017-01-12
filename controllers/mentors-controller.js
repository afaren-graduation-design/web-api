var apiRequest = require('../services/api-request');
var MentorService = require('../services/mentor-service/MentorService');

const mentorService = new MentorService();

class MentorsController {

  search(req, res, next) {
    const email = req.query.email;
    apiRequest.get('users/search', {email: email, privilege: 'MENTOR'}, (err, resp) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(resp.body);
    });
  }

  findAllMentors(req, res, next) {
    const to = req.session.user.id;
    mentorService.findAllMentors({to}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(data);
    });
  }
}

module.exports = MentorsController;