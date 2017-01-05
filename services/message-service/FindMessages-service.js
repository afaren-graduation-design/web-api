import async from 'async';
var apiRequest = require('../api-request');
import Message from '../../models/messages';

export default class FindMessagesService {

  findMessage({id, state}, callback) {
    async.waterfall([
      (done) => {
        if (state === 0) {
          Message.find({to: id, state: state}, done);
        } else {
          Message.find({to: id}, done);
        }
      },
      (data, done) => {
        async.map(data, (message, callback) => {
          apiRequest.get(`users/${message.from}/detail`, (err, res) => {
            callback(err, Object.assign({},
              {
                _id: message._id,
                from: message.from,
                to: message.to,
                type: message.type,
                deeplink: message.deeplink,
                state: message.state
              },
              {fromDetail: res.body.name}));
          });
        }, done);
      }], callback);
  }
}
