const Program = require('../../models/program');
const async = require('async');
const apiRequest = require('../api-request');

class ProgramService {
  create(req, callback) {
    let programInfo = req.body;
    let makerId = req.session.user.id;
    async.waterfall([
      (done) => {
        apiRequest.post('programs', programInfo, done);
      },
      (resp, done) => {
        Object.assign(programInfo, {programId: resp.body.id, makerId});
        Program.create(programInfo, done);
      }
    ], (err, doc) => {
      callback(err, doc);
    })
  }

  update({_id, programInfo}, callback) {
    async.waterfall([
      (done) => {
        Program.findByIdAndUpdate(_id, programInfo, done);
      },
      (docs, done) => {
        if (!docs) {
          return done({status: 404}, null);
        }
        apiRequest.put(`programs/${docs.programId}`, programInfo, done);
      }
    ], (err) => {
      callback(err);
    })
  }

  getList(makerId, callback) {
    async.waterfall([
      (done) => {
        Program.find({makerId}, done);
      },
      (docs, done) => {
        async.map(docs, (doc, cb) => {
          apiRequest.get(`programs/${doc.programId}/users`, (err, response) => {
            let item = doc.toJSON();
            if(response.statusCode === 404){
              item.peopleNumber = 0;
              return cb(null, item);
            }
            if (err) {
              return done(err, null);
            }

            item.peopleNumber = response.body.usersUri.length;
            return cb(null, item);
          })
        }, (err, result) => {
          done(err, result);
        })
      }
    ], (err, result) => {
      callback(err, result);
    })
  }
}

module.exports = ProgramService;
