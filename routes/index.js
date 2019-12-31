var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Answer = require("../models/answer");
var passport = require("passport");
var User = require("../models/user");
var mongoose = require("mongoose");
var middleware = require("../middleware");

router.get("/", (req, res)=>{
    res.render("landing.ejs");
});

router.get("/users/:id", middleware.checkUser, (req, res)=>{
    User.findById(mongoose.Types.ObjectId(req.params.id), function(err, user){
        if (err){
            console.log(err);
            req.flash("error", "Something Went Wrong");
            res.redirect("back");
        } else {
            var validQuestions = []
            Question.find({}, function(err, questions){
                if (err){
                    console.log(err)
                } else {
                    questions.forEach(function(q){
                        if (q.author.id.equals(user._id)){
                            validQuestions.push(q);
                        }
                    });
                    res.render("user.ejs", {user: user, questions: validQuestions});
                }
            });
        }
    });
});

//Authorization Routes
router.get("/register", (req, res)=>{
    res.render("register.ejs");
});

router.post("/register", (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/questions");
        });
    });
});

router.get("/login", (req, res)=>{
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/questions",
    failureRedirect: "/login",
    failureFlash: "Username or Password is incorrect"
}), (req, res)=>{

});

router.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
});

module.exports = router;