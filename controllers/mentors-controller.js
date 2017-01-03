var apiRequest = require('../services/api-request');
var async = require('async');
import Message from '../models/messages';

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
    const from = req.session.user.id;
    async.waterfall([
          (done) => {
            Message.find({from: from}, done);
          },
          (data, done) => {
            var mentorOfStudent = data.map(message => {
              return {mentorId: message.to, state: message.state};
            });
            done(null, mentorOfStudent);
          },
          (data, done) => {
            async.map(data, (mentor, callback) => {
              apiRequest.get(`users/${mentor.mentorId}/detail`, (err, res) => {
                if (err) {
                  callback(err, null);
                }
                callback(null, Object.assign({}, {name: res.body.name}, {state: mentor.state}));
              });
            }, done);
          }],
        (err, data) => {
          if (err) {
            return next(err);
          } else {
            res.status(200).send(data);
          }
        });
  }

}

