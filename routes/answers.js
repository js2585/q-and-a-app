var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var Answer = require("../models/answer");
var mongoose = require("mongoose");

router.post("/questions/:id/answers", isLoggedIn, (req, res)=>{
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
                    res.redirect("/questions/" + question._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;