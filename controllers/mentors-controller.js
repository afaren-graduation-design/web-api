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
    let mentors = [];
    async.waterfall([
      (done) => {
        Message.find({to: to}, done);
      },
      (data, done) => {
        var mentorOfStudent = data.filter(message => {
          return message.type.indexOf('INVITATION') !== -1;
        });
        done(null, mentorOfStudent);
      },
      (data, done) => {
        async.map(data, (item, callback) => {
          apiRequest.get(`users/${item.from}/detail`, (err, res) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, Object.assign({}, {name: res.body.name, type: item.type, '_id': item._id}));
            }
          });
        }, done);
      },
      (data, done) => {
        mentors = data;
        Message.find({from: to}, done);
      },
      (data, done) => {
        var mentorOfStudent = data.filter(message => {
          return message.type.indexOf('INVITATION') !== -1;
        });
        done(null, mentorOfStudent);
      },
      (data, done) => {
        async.map(data, (item, callback) => {
          apiRequest.get(`users/${item.to}/detail`, (err, res) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, Object.assign({}, {name: res.body.name, type: item.type, '_id': item._id}));
            }
          });
        }, done);
      },
      (data, done) => {
        mentors = mentors.concat(data);
        let msgObj = [];
        mentors.forEach((item) => {
          let exit = msgObj.find((msg) => {
            return item._id.equals(msg._id);
          });
          if (!exit) {
            msgObj.push(item);
          }
        });
        done(null, msgObj);
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
