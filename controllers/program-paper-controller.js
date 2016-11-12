var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');

function ProgramPaperController () {

}

ProgramPaperController.prototype.getPaper = (req, res, next) => {
    var programId = req.params.programId;
    var paperId = req.params.paperId;

    var paperUrl = 'program/' + programId + '/paper/' + paperId;

    apiRequest.get(paperUrl, (err,resp) => {
        if (!err && resp) {
            res.status(200).send(resp.body)

        } else {
            // res.status(constant.httpCode.NOT_FOUND).send("NOT_FOUND");
            next();
        }
    })
};

module.exports = ProgramPaperController;