var apiRequest = require('../services/api-request');

export default class MentorsController {
  search(req, res, next) {
    const email = req.query.email;
    apiRequest.get('users/search', {email: email, privilege: 'MENTOR'}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send(JSON.parse(data.text));
    });
  }
}

