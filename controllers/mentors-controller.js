var apiRequest = require('../services/api-request');

export default class MentorsController {
  search(req, res) {
    const email = req.query.email;
    apiRequest.get('users/search', {email: email, privilege: 'MENTOR'}, (err, data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).send(JSON.parse(data.text));
    });
  }
}

