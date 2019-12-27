var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Answer = require("../models/answer");
var mongoose = require("mongoose");
router.get("/questions", isLoggedIn, (req, res)=>{
    Question.find({}, function(err, questions){
        if (err){
            console.log(err);
        } else {
            res.render("questions.ejs", {questions: questions});
        }
    })
});

router.post("/questions", isLoggedIn, (req, res)=>{
    var newQuestion = req.body.q;
    newQuestion.author = {id: req.user._id, username: req.user.username};
    Question.create(newQuestion, function(err, result){
        if (err){
            console.log(err);
        } else {
            res.redirect("/questions");
        }
    })
});

router.get("/questions/ask", isLoggedIn, (req, res)=>{
    res.render("newQuestion.ejs");
});

router.get("/questions/:id", isLoggedIn, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id)).populate("answers").exec(function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("show.ejs", {question: response});
        }
    });
});

router.get("/questions/:id/edit", isLoggedIn, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("edit.ejs", {question: response});
        }
    });
});

router.put("/questions/:id", isLoggedIn, (req, res)=>{
    var newQuestion = req.body.q;
    Question.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), newQuestion, function(err, resonse){
        if (err){
            console.log(err);
        } else {
            res.redirect("/questions/" + req.params.id);
        }
    });
});

router.delete("/questions/:id", isLoggedIn, (req, res)=>{
    Question.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err){
        res.redirect("/questions");
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;