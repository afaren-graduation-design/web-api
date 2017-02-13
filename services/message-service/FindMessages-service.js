var async = require('async');
var apiRequest = require('../api-request');
var Message = require('../../models/messages');

class FindMessagesService {

  findMessage({id, state}, callback) {
    async.waterfall([
      (done) => {
        if (state === 0) {
          Message.find({to: id, state: state}, done)
        } else {
          Message.find({to: id}, done)
        }
      },
      (doc, done) => {
        doc.sort((a, b) => b.updatedAt - a.updatedAt);
        done(null, doc)
      },
      (data, done) => {
        if (data.length === 0) {
          return done(null, data);
        }
        const fromIds = data.map((item) => {
          return item.from;
        });
        const userIds = this.removeDuplicate(fromIds);
        apiRequest.get(`users/${userIds.toString()}/detail`, (err, resp) => {
          if (err) {
            return done(err, null);
          }
          const userList = resp.body.userList ? resp.body.userList : [].concat(resp.body);
          const items = [];
          data.forEach((message) => {
            userList.forEach((item) => {
              const existence = (item.userId === message.from);
              if (existence) {
                items.push(Object.assign({},
                  {
                    _id: message._id,
                    to: message.to,
                    type: message.type,
                    updatedAt: message.updatedAt,
                    deeplink: message.deeplink,
                    state: message.state
                  },
                  {fromDetail: item}
                ));
              }
            });
          });
          done(null, items);
        });
      }
    ], callback);
  }

  removeDuplicate(arr) {
    let result = [];
    arr.forEach((item) => {
      let existence = result.find(id => id === item);
      if (!existence) {
        result.push(item);
      }
    });
    return result;
  }
}

module.exports = FindMessagesService;
