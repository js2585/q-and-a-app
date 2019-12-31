//Schema
var mongoose = require("mongoose");
var questionSchema = new mongoose.Schema({
    title: String,
    body: String,
    course: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        name: String
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: {type: Date, default: Date.now}  
});

module.exports = mongoose.model("Question", questionSchema);