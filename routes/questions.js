var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Answer = require("../models/answer");
var mongoose = require("mongoose");
var middleware = require("../middleware");
router.get("/questions", middleware.isLoggedIn, (req, res)=>{
    Question.find({}, function(err, questions){
        if (err){
            console.log(err);
        } else {
            res.render("questions.ejs", {questions: questions});
        }
    })
});

router.post("/questions", middleware.isLoggedIn, (req, res)=>{
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

router.get("/questions/ask", middleware.isLoggedIn, (req, res)=>{
    res.render("newQuestion.ejs");
});

router.get("/questions/:id", middleware.isLoggedIn, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id)).populate("answers").exec(function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("show.ejs", {question: response});
        }
    });
});

router.get("/questions/:id/edit", middleware.checkQuestionOwnership, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("edit.ejs", {question: response});
        }
    });
});

router.put("/questions/:id", middleware.checkQuestionOwnership, (req, res)=>{
    var newQuestion = req.body.q;
    Question.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), newQuestion, function(err, resonse){
        if (err){
            console.log(err);
        } else {
            res.redirect("/questions/" + req.params.id);
        }
    });
});

router.delete("/questions/:id", middleware.checkQuestionOwnership, (req, res)=>{
    Question.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err, removed){
        if (err){
            console.log(err);
        } else {
            Answer.deleteMany({_id: {$in: removed.answers}}, function(err){
                if (err){
                    console.log(err);
                } else {
                    res.redirect("/questions");
                }
            })
        }
    });
});

module.exports = router;