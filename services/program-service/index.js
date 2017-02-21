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
        Object.assign(programInfo, {programId: resp.body.programId});
        Program.create(programInfo, done);
      },
      (doc, done)=> {
        if (!doc) {
          return done({status: 400}, null);
        }
        doc.programUri.uri.push(`https://local.thoughtworks.school/?program=${doc._id}`);
        done(null, null);
      }
    ], (err)=> {
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
}

module.exports = ProgramService;
