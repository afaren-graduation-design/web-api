'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var programPaperSchema = new Schema({
    id: Number,
    title: String,
    isDistribution: Boolean,
    programId: Number,
    makerId: Number,
    createTime: String,
    sections: [
        {
            description:String,
            type:String,
            quizzes:[String]
        }
    ]
});

module.exports = mongoose.model('ProgramPaper', programPaperSchema);
