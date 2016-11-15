'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperDefinitionSchema = new Schema({
    title: String,
    isDistribution: Boolean,
    programId: Number,
    makerId: Number,
    createTime: String,
    updateTime: String,
    sections: [
        {
            title:String,
            quizzes:Object
        }
    ]
});

module.exports = mongoose.model('PaperDefinition', paperDefinitionSchema);
