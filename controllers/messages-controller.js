import Message from '../models/messages';
import MessageService from '../services/message-service';
import FindMessageService from '../services/message-service/FindMessages-service'

const messageService = new MessageService();
export default class MessagesController {
  constructor() {
    this.findMessageService = new FindMessageService();
  }

  findAll(req, res, next) {
    console.log('=====findAll=====');
    this.findMessageService.findMessage({}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(data);
    });
  }

  findUnread(req, res, next) {
    console.log('=====findUnread=====');
    const state = 0;
    this.findMessageService.findMessage({state}, (err, data) => {
      if (err) {
        return next(err);
      }
      console.log(data);
        res.status(200).send(data);
    });
  }

  create(req, res, next) {
    const from = req.session.user.id;
    const data = Object.assign({}, req.body, {from});

    new Message(data).save((err, data) => {
      if (err) {
        return next(err);
      }
      res.status(201).send({uri: `messages/${data._id}`});
    });
  }

  update(req, res, next) {
    const messageId = req.params.messageId;
    const operation = req.params.operation;
    messageService.operate({messageId, operation}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(204);
    });
  }
}

