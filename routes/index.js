var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Answer = require("../models/answer");
var passport = require("passport");
var User = require("../models/user");
var mongoose = require("mongoose");

router.get("/", (req, res)=>{
    res.render("landing.ejs");
});

//Authorization Routes
router.get("/register", (req, res)=>{
    res.render("register.ejs");
});

router.post("/register", (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
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
    failureRedirect: "/login"
}), (req, res)=>{

});

router.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;