import Message from '../models/messages';
var async = require('async');
import MessageService from '../services/message-service';
var apiRequest = require('../services/api-request');
var httpStatus = require('../mixin/constant').httpCode;

export default class MessagesController {

  search(req, res) {
    const from = req.session.user.id;
    async.waterfall([
      (done) => {
        Message.find({from: from}, done);
      }, (data, done) => {
        if (!data) {
          var error = httpStatus.NOT_FOUND;
          done(error, null);
        } else {
          done(null, data);
        }
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
        }, (err, result) => {
          done(err, result);
        });
      }],
    (err, result, next) => {
      if (result) {
        res.send(result);
      } else if (err === httpStatus.NOT_FOUND) {
        res.send({
          status: httpStatus.NOT_FOUND
        });
      } else {
        next(err);
      }
    });
  }

  findUnread(req, res) {
    const to = req.session.user.id;
    async.waterfall([
      (done) => {
        Message.find({to: to, state: 0}, done);
      }, (data, done) => {
        if (!data) {
          var error = httpStatus.NOT_FOUND;
          done(error, null);
        } else {
          done(null, data);
        }
      },
      (data, done) => {
        async.map(data, (message, callback) => {
          apiRequest.get(`users/${message.from}/detail`, (err, res) => {
            if (err) {
              callback(err, null);
            }
            callback(null, Object.assign({},
              {
                _id: message._id,
                from: message.from,
                to: message.to,
                type: message.type,
                deeplink: message.deeplink,
                state: message.state
              },
              {name: res.body.name}));
          });
        }, done);
      }],
      (err, results) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(results);
        }
      });
  }

  create(req, res) {
    const from = req.session.user.id;
    const data = Object.assign({}, req.body, {from});

    new Message(data).save((err, data) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(201).send({uri: `messages/${data._id}`});
    });
  }

  update(req, res, next) {
    const messageId = req.params.messageId;
    const operation = req.params.operation;
    const messageService = new MessageService();
    messageService.operate({messageId, operation}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(201);
    });
  }
}

