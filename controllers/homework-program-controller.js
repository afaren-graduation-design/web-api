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

module.exports = HomeworkProgramController;
