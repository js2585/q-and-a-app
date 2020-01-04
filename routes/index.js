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
            Question.find({"author.id": user._id}, function(err, questions){
                if (err){
                    console.log(err);
                } else {
                    res.render("user.ejs", {user: user, questions: questions});
                }
            }).populate("answers");
        }
    });
});

router.post("/users/:id/changeUsername", middleware.checkUser, (req, res)=>{
    User.findById(mongoose.Types.ObjectId(req.params.id), function(err, user){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            User.find({}, function(err, users){
                var stop = false;
                users.forEach(function(use){
                    if (use.username === req.body.usernameChange){
                        stop = true;
                    }
                });
                var noSpace = req.body.usernameChange.replace(/ /g, "");
                if (noSpace.length < 1){
                    stop = true;
                }
                if (stop){
                    req.flash("error", "Username Already Taken");
                    res.redirect("back");
                } else {
                    Question.find({"author.username": user.username}, function(err, questions){
                        questions.forEach(function(q){
                            q.author.username = req.body.usernameChange;
                            q.save();
                        });
                    });
                    Answer.find({"author.username": user.username}, function(err, answers){
                        answers.forEach(function(a){
                            a.author.username = req.body.usernameChange;
                            a.save();
                        });
                    });
                    user.username = req.body.usernameChange;
                    user.save();
                    req.flash("success", "Username Changed");
                    res.redirect("back");
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
    var noSpace = req.body.username.replace(/ /g, "");
    if (noSpace.length > 0){
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
    } else {
        req.flash("error", "Invalid Username");
        res.redirect("/register");
    }
    
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