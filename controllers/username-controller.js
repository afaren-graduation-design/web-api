var apiRequest = require('../services/api-request');
var Token = require('../models/token');

function UsernameController () {

}


UsernameController.prototype.getUsername = (req, res) => {
    var uuid = req.cookies.uuid;
    console.log(uuid)
    Token.findOne({uuid}).exec((err,user)=>{
        if(!err && user) {
            apiRequest.get(`users/${user.id}/detail`, (err, resp) => {
                console.log(resp.body)
                   if(!err && resp){
                       res.status(200).send({username:resp.body.name})
                   } else {
                       res.sendStatus(404);
                   }
            })
        }else {
            next();
        }
    })
};

module.exports = UsernameController;
