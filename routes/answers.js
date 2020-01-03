var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Answer = require("../models/answer");
var mongoose = require("mongoose");
var middleware = require("../middleware");

router.post("/questions/:id/answers", middleware.isLoggedIn, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, question){
        if (err){
            console.log(err);
        } else {
            Answer.create({text: req.body.answer}, function(err, ans){
                if (err){
                    console.log(err);
                } else {
                    ans.author.id = req.user._id;
                    ans.author.username = req.user.username;
                    ans.save();
                    question.answers.push(ans);
                    question.save();
                    req.flash("success", "Answer Posted");
                    res.redirect("/questions/" + question._id);
                }
            });
        }
    });
});

router.post("/questions/:id/answers/:answerId", middleware.isLoggedIn, (req, res)=>{
    Answer.findById(mongoose.Types.ObjectId(req.params.answerId), function(err, answer){
        if (err){
            console.log(err);
            req.flash("error", "Something Went Wrong");
            res.redirect("back");
        } else {
            var remove = false;
            answer.upvotes.forEach(function(user, index, arr){
                if (user.equals(req.user._id)){
                    arr.splice(index, 1);
                    remove = true;
                }
            });
            if (!remove){
                answer.upvotes.push(req.user);
            }
            answer.save();
            res.json(answer);
        }
    });
});

router.get("/questions/:id/answers/:answerId/edit", middleware.checkAnswerOwnership, (req, res)=>{
    Answer.findById(mongoose.Types.ObjectId(req.params.answerId), function(err, answer){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("answerEdit.ejs", {answer: answer, questionId: req.params.id});
        }
    });
});

router.put("/questions/:id/answers/:answerId", middleware.checkAnswerOwnership, (req, res)=>{
    var answer = req.body.answer;
    Answer.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.answerId), {text: answer}, function(err, updated){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Answer Updated");
            res.redirect("/questions/" + req.params.id);
        }
    });
});

router.delete("/questions/:id/answers/:answerId", middleware.checkAnswerOwnership, (req, res)=>{
    Answer.findByIdAndRemove(mongoose.Types.ObjectId(req.params.answerId), function(err, removed){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Answer Deleted");
            res.redirect("/questions/" + req.params.id);
        }
    });
});


module.exports = router;