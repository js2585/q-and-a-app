var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    name: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
});

module.exports = mongoose.model("Course", courseSchema);