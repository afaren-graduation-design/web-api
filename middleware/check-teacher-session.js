'use strict';
var TeacherSession = require('../models/teacher-session');
var mongoose = require('mongoose');


const checkSession= function (req, res, next) {
    let session = req.cookies.user;
    TeacherSession.findOne({userHash:session},(err,data)=>{
        if(data){
            next();
        }else {
            res.sendStatus(401);
        }
    })

};
module.exports =  checkSession;