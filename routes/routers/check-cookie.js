var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const mongoConn = require('../../services/mongo-conn');

// mongoConn.start('mongodb://localhost/userCookie');

const Schema = mongoose.Schema;

const userCookie = new Schema({
    userHash: String
});

const UserCookie = mongoose.model('userCookies', userCookie);

router.get('/', (req, res) => {
    const userHash = '1234sa5678';

    new UserCookie({userHash: '12345678'}).save((err)=> {
        if (err)
            return next(err);
        UserCookie.findOne({userHash}, (err, user)=> {
            if (err)
                return next(err);
            console.log(user);
            if (user) {
                return res.sendStatus(200);
            }
            return res.sendStatus(403);
        })
    })
});
module.exports = router;