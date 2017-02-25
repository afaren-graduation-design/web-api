const async = require('async');
const apiRequest = require('../services/api-request');

class UserAuthorityController {
  getUsers(req, res, next) {
    apiRequest.get('/user-authority', (err ,docs) => {
      if(err) {
        return next(err);
      }
      return res.status(200).send(docs);
    });
  }

  updateUsers(req, res, next) {
    const email = req.params.email;
    const userInfo = req.body;
    apiRequest.put(`user-authority/${email}`, userInfo, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }

  createUser(req,res,next){
    apiRequest.post('/user-authority',req.body,(err,docs)=>{
      if(err) {
        return next(err);
      }
      var timestamp = docs._id.toString().substring( 0, 8 );
      var createTime = Date.parse(new Date( parseInt( timestamp, 16 ) * 1000 ));
      console.log(createTime);
      return res.status(201).send(Object.assign({},req.body,createTime));
    })
  }
}

module.exports = UserAuthorityController;