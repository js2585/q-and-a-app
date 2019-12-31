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
    });
});

router.get("/courses/:name", middleware.isLoggedIn, (req, res)=>{
    var name = req.params.name.replace(/-/g, " ");
    Course.findOne({name: name}).populate("questions").exec(function(err, course){
        if (err){
            console.log(err);
        } else {
            res.render("filter.ejs", {course: course});
        }
    });
});

module.exports = router;