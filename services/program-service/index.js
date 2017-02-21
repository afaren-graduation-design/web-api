const Program = require('../../models/program');
const async = require('async');
const apiRequest = require('../api-request');

class ProgramService {
  create(programInfo, callback) {
    async.waterfall([
      (done) => {
        apiRequest.post('programs', programInfo, done);
      },
      (resp, done) => {
        Object.assign(programInfo, {programId: resp.body});
        Program.create(programInfo, done);
      }
    ], (err) => {
      callback(err);
    })
  }

  update({programId, programInfo}, callback) {
    async.waterfall([
      (done) => {
        Program.findByIdAndUpdate(programId, programInfo, done);
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

  getList(userId, callback) {
    async.waterfall([
      (done) => {
        apiRequest.get(`users/${userId}/programs`, done);
      },
      (resp, done) => {
        Program.find({programId: {$in: resp.body.programIds}}, done);
      },
      (docs, done) => {
        async.map(docs, (doc, cb) => {
          apiRequest.get(`programs/${doc.programId}/users`, (err, response) => {
            if (err) {
              return done(err, null);
            }
            let item = doc.toJSON();
            item.peopleNumber = response.body.usersUri.length;
            cb(null, item);
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
