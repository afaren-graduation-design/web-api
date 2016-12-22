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
}

