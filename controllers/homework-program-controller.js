"use strict";

var HomeworkDefinition =require( '../models/homework-definition');

function HomeworkProgramController () {

};

HomeworkProgramController.prototype.getHomeworkList = (req, res) => {
    let pageCount = req.query.pageCount;
    let page = req.query.page;
    let skipCount = pageCount*(page-1);

    HomeworkDefinition.find({}).limit(Number(pageCount)).select({description:1,_id:1}).skip(skipCount).exec((err,data)=>{
        if(!err && data){
            res.status(200).send(data);
        } else {
            res.sendStatus(404);
        }
    })
};

HomeworkProgramController.prototype.updateHomework = (req, res) => {
    const {name, type, definitionRepo} = req.body;
    const homeworkId = req.params.homeworkId;

    HomeworkDefinition.update({homeworkId}, {$set: {name, type, definitionRepo}}, (err) => {
        if(!err){
            res.sendStatus(204);
        }else{
            res.sendStatus(400);
        }
    })
};

module.exports = HomeworkProgramController;
