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
            console.log('find out-----');
            console.log(data);
            async.map(data, (message, callback) => {
              apiRequest.get(`users/${message.from}/detail`, (err, res) => {
                if (err) {
                  callback(err, null);
                }
                callback(null, Object.assign({},
                    {from: message.from, to: message.to, type: message.type, deeplink: message.deeplink, state: message.state},
                    {name: res.body.name}));
              });
            }, (err, result) => {
              done(err, result);
            });
          }],
        (err, result) => {
          console.log('paper---');
          console.log(result);
          if (err) {
            res.send(err);
          } else {
            res.status(200).send(result);
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
    const messageService = new MessageService();
    messageService.msgOperation({messageId, operation}, (err, data) => {
      if (err) {
        throw err;
      }
      res.sendStatus(201);
    });
  }
}

