var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();
    methodOveride = require("method-override");
    Question = require("./models/question");
    Answer = require("./models/answer");
    seedDB = require("./seed");
var PORT = 3001;
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOveride("_method"));
seedDB();
mongoose.connect("mongodb://localhost/parsons_road", {useNewUrlParser: true, useUnifiedTopology: true});



app.get("/", (req, res)=>{
    res.render("landing.ejs");
});

app.get("/questions", (req, res)=>{
    Question.find({}, function(err, questions){
        if (err){
            console.log(err);
        } else {
            res.render("questions.ejs", {questions: questions});
        }
    })
});

app.post("/questions", (req, res)=>{
    var newQuestion = req.body.q;
    Question.create(newQuestion, function(err, result){
        if (err){
            console.log(err);
        } else {
            res.redirect("/questions");
        }
    })
});

app.get("/questions/ask", (req, res)=>{
    res.render("newQuestion.ejs");
});

app.get("/questions/:id", (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id)).populate("answers").exec(function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("show.ejs", {question: response});
        }
    });
});

app.get("/questions/:id/edit", (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("edit.ejs", {question: response});
        }
    });
});

app.put("/questions/:id", (req, res)=>{
    var newQuestion = req.body.q;
    Question.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), newQuestion, function(err, resonse){
        if (err){
            console.log(err);
        } else {
            res.redirect("/questions/" + req.params.id);
        }
    });
});

app.delete("/questions/:id", (req, res)=>{
    Question.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err){
        res.redirect("/questions");
    });
});

app.post("/questions/:id/answers", (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, question){
        if (err){
            console.log(err);
        } else {
            Answer.create({text: req.body.answer, author: "Jatong"}, function(err, ans){
                if (err){
                    console.log(err);
                } else {
                    question.answers.push(ans);
                    question.save();
                    res.redirect("/questions/" + question._id);
                }
            })
        }
    })
})

app.listen(PORT, function(){
    console.log("Running on port " + PORT);
});