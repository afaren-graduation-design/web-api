var apiRequest = require('../services/api-request');
var async = require('async');
import Message from '../models/messages';
import MentorService from '../services/mentor-service/MentorService';

export default class MentorsController {
  search(req, res, next) {
    const email = req.query.email;
    apiRequest.get('users/search', {email: email, privilege: 'MENTOR'}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(JSON.parse(data.text));
    });
  }

  findMentorOfStudent(req, res, next) {
    const to = req.session.user.id;
    const mentorService = new MentorService();
    mentorService.handle({to}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(data);
    })

  }
}
