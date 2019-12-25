//Schema
var mongoose = require("mongoose");
var questionSchema = new mongoose.Schema({
    title: String,
    body: String,
    course: String,
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    }]  
});

module.exports = new mongoose.model("Question", questionSchema);