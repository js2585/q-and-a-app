var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Course = require("../models/course");
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
    var newQuestion = {};
    newQuestion.title = req.body.q.title;
    newQuestion.body = req.body.q.body;
    newQuestion.author = {id: req.user._id, username: req.user.username};
    Course.findOne({name: req.body.q.course.toLowerCase()}, function(err, course){
        if (err){
            console.log(err);
            res.redirect("/questions/ask");
        } else {
            if (course){
                Question.create(newQuestion, function(err, question){
                    if (err){
                        console.log(err);
                    } else {
                        question.course.id = course;
                        question.course.name = req.body.q.course.toLowerCase();
                        question.save();
                        course.questions.push(question);
                        course.save();
                        req.flash("success", "Question Posted");
                        res.redirect("/questions");
                    }
                });
            } else {
                res.render("reAsk.ejs", {question: newQuestion});
            } 
        }
    });
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
    var newQuestion = {};
    newQuestion.title = req.body.q.title;
    newQuestion.body = req.body.q.body;
    Course.findOne({name: req.body.q.course.toLowerCase()}, function(err, course){
        if (err){
            console.log(err);
            res.redirect("/questions/ask");
        } else {
            if (course){
                Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, question){
                    if (err){
                        console.log(err);
                    } else {
                        if (course._id.equals(question.course.id)){
                            console.log("Same Course");
                            question.title = newQuestion.title;
                            question.body = newQuestion.body;
                            question.save();
                            req.flash("success", "Question Updated");
                            res.redirect("/questions/" + req.params.id);
                        } else {
                            console.log("Different Course");
                            Course.findById(mongoose.Types.ObjectId(question.course.id), function(err, found){
                                if (err){
                                    console.log(err);
                                } else {
                                    found.questions.forEach(function(q, index, arr){
                                        if (q.equals(question._id)){
                                            arr.splice(index, 1);
                                        }
                                    });
                                    found.save();
                                    question.title = newQuestion.title;
                                    question.body = newQuestion.body;
                                    question.course.id = course;
                                    question.course.name = req.body.q.course.toLowerCase();
                                    question.save();
                                    course.questions.push(question);
                                    course.save();
                                    req.flash("success", "Question Updated");
                                    res.redirect("/questions/" + req.params.id);
                                }
                            });
                        }
                    }
                });
            } else {
                req.flash("error", "Invalid Course");
                res.redirect("back");
            } 
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
                    req.flash("success", "Question Deleted");
                    res.redirect("/questions");
                }
            })
        }
    });
});

module.exports = router;