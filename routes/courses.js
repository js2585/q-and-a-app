var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Answer = require("../models/answer");
var Course = require("../models/course")
var mongoose = require("mongoose");
var middleware = require("../middleware");

router.get("/courses", middleware.isLoggedIn, (req, res)=>{
    Course.find({}, function(err, courses){
        res.render("courses.ejs", {courses, courses});
    }).sort({"name": 1});
});

router.get("/courses/:name", middleware.isLoggedIn, (req, res)=>{
    var pagination = 10;
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var name = req.params.name.replace(/-/g, " ");
    Question.countDocuments({"course.name": name}, function(err, count){
        Question.find({"course.name": name}, function(err, questions){
            if (err){
                console.log(err);
            } else {
                res.render("filter.ejs", {questions: questions, total: count, page: page, pagination: pagination, courseName: name});
            }
        }).populate("answers").sort({date: -1}).skip((page - 1) * pagination).limit(pagination);
    });
    // Course.findOne({name: name}).populate("questions").exec(function(err, course){
    //     if (err){
    //         console.log(err);
    //     } else {
    //         if (course){
    //             course.questions.sort(function(a, b){return -(a.date - b.date)});
    //             course.questions.forEach(function(q){
    //                 q.populate("answers");
    //             });
    //         }
    //         res.render("filter.ejs", {course: course, pagination: pagination, page: page});
    //     }
    // });
});

module.exports = router;