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
    const to = req.session.user.id;
    async.waterfall([
      (done) => {
        Message.find({to: to}, done);
      },
      (data, done) => {
        Message.find({from: to}, (err, doc) => {
          done(err, data.concat(doc));
        });
      },
      (data, done) => {
        let msgObj = [];
        data.forEach((item) => {
          let exit = msgObj.find((msg) => {
            return item._id.equals(msg._id);
          });
          if (!exit) {
            msgObj.push(item);
          }
        });
        done(null, msgObj);
      },
      (data, done) => {
        var mentorOfStudent = data.filter(message => {
          return message.type.indexOf('INVITATION') !== -1;
        });
        done(null, mentorOfStudent);
      },
      (data, done) => {
        async.map(data, (mentor, callback) => {
          apiRequest.get(`users/${mentor.to}/detail`, (err, res) => {
            if (err) {
              callback(err, null);
            }
            callback(null, Object.assign({}, {name: res.body.name}, {state: mentor.state}, {type: mentor.type}));
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
