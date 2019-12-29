var Question = require("../models/question");
var Answer = require("../models/answer");
var mongoose = require("mongoose");
var middlewareObj = {};

middlewareObj.checkQuestionOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, response){
            if (err){
                res.redirect("/questions");
            } else {
                if (req.user._id.equals(response.author.id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkAnswerOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Answer.findById(mongoose.Types.ObjectId(req.params.answerId), function(err, found){
            if (err){
                res.redirect("/questions");
            } else {
                if (req.user._id.equals(found.author.id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;