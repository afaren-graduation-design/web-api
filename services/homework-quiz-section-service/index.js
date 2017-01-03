export default class HomeWorkQuizSectionService{
  getStatus(section, callback) {
    async.waterfall([
      (done) => {

      }
    ], (err, result) => {
      if (err) {
        throw err;
      }
      else {
        callback(null, {type: '--', status: 'qqq'});
      }
    })
  }
}