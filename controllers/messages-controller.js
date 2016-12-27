import Message from '../models/messages';

export default class MessagesController {
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
}

