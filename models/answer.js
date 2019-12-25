var mongoose = require("mongoose");

var answerSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Answer", answerSchema);