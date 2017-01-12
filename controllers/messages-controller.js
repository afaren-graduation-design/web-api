var Message = require('../models/messages');
var MessageService = require('../services/message-service');
var FindMessageService = require('../services/message-service/FindMessages-service');
var constant = require('../mixin/constant');

const messageService = new MessageService();
const findMessageService = new FindMessageService();

class MessagesController {
  findAll(req, res, next) {
    const id = req.session.user.id;
    findMessageService.findMessage({id}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(constant.httpCode.OK).send({items: data, totalCount: data.length});
    });
  }

  findUnread(req, res, next) {
    const id = req.session.user.id;
    const state = 0;
    findMessageService.findMessage({id, state}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(constant.httpCode.OK).send({items: data, totalCount: data.length});
    });
  }

  create(req, res, next) {
    const from = req.session.user.id;
    const data = Object.assign({}, req.body, {from});

    new Message(data).save((err, data) => {
      if (err) {
        return next(err);
      }
      res.status(constant.httpCode.CREATED).send({uri: `messages/${data._id}`});
    });
  }

  update(req, res, next) {
    const messageId = req.params.messageId;
    const operation = req.params.operation;
    messageService.operate({messageId, operation}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }
}

module.exports = MessagesController;