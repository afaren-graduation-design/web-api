import async from 'async';
import Message from '../../models/messages';
import apiRequest from '../api-request';

export default class MentorService {
  findAllMentors({to}, callback) {
    let mentors = [];
    async.waterfall([
      (done) => {
        apiRequest.get(`users/${to}/mentors`, (err, res) => {
          done(err, res.body.mentorIds);
        });
      },
      (data, done) => {
        if (!data.length) {
          return done(null, data);
        }
        apiRequest.get(`users/${data.toString()}/detail`, (err, res) => {
          const userList = res.body.userList ? res.body.userList : [].concat(res.body);
          done(err, userList);
        });
      },
      (data, done) => {
        mentors = data.map(({userId, name}) => {
          return {userId, name, type: 'AGREE_INVITATION'};
        });
        Message.find({from: to, type: 'INVITATION', state: 0}, done);
      },
      (data, done) => {
        if (!data.length) {
          return done(null, null);
        }
        let mentorIds = [];
        data.forEach((item) => {
          let exit = mentorIds.find(id => {
            return id === item.to;
          });
          if (!exit) {
            mentorIds.push(item.to);
          }
        });
        done(null, mentorIds);
      },
      (data, done) => {
        apiRequest.get(`users/${data.toString()}/detail`, (err, res) => {
          const userList = res.body.userList ? res.body.userList : [].concat(res.body);
          let mentorObj = userList.map(({userId, name}) => {
            return {userId, name, type: 'INVITATION'};
          });
          done(err, mentorObj);
        });
      }], (err, data) => {
      if (data) {
        mentors = mentors.concat(data);
      }
      callback(err, mentors);
    });
  }
}
