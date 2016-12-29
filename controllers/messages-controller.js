import Message from '../models/messages';
var async = require('async');
import messageService from '../services/message-service';
var apiRequest = require('../services/api-request');
var httpStatus = require('../mixin/constant').httpCode;

export default class MessagesController {

  find(req, res) {
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

  create(req, res) {
    const from = req.session.user.id;
    const data = Object.assign({}, req.body, {from});

    new Message(data).save((err, data) => {
      if (err) {
        res.send(err);
      }
      res.status(201).send({uri: `messages/${data._id}`});
    });
  }

  createNewMessage(req, res) {
    const id = req.params.messagesId;
    Message.findById(id, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        let messageData = data;
        messageData._id = undefined;
        delete messageData._id;
        const from = req.session.user.id;
        if (req.params.operation === 'agreement') {
          messageData.state = 2;
        } else {
          messageData.state = 3;
        }
        const newMessage = Object.assign({}, {from}, messageData);
        new Message(newMessage).save((err, newMessage) => {
          if (err) {
            res.send(err);
          }
          res.status(200).send({uri: `messages/${newMessage._id}/:operation`});
        });
      }
    });
  }

  operateMessage(req, res) {
    const messageId = req.params.messageId;
    const operation = req.params.operation;
    messageService({messageId, operation}, (err, data) => {
      if (err) {
        throw err;
      }
      res.sendStatus(201);
    });
  }
}

