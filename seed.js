var mongoose = require("mongoose");
var Question = require("./models/question");
var Answer = require("./models/answer");
var Course = require("./models/course");

var data = [
    {
        name: "ap lang",
    },
    {
        name: "ap world",
    },
    {
        name: "bc calc",
    }
]

function seedDB(){
    Course.deleteMany({}, function(err){
        if (err){
            console.log(err);
        } else {
            data.forEach(function(course){
                Course.create(course, function(err, result){
                    if (err){
                        console.log(err);
                    }
                });
            });
        }
    });
    
    // Question.deleteMany({}, function(err){
    //     // if(err){
    //     //     console.log(err)
    //     // } else {
    //     //     console.log("Removed Questions");
    //     //     data.forEach(function(q){
    //     //         Question.create(q, function(err, question){
    //     //             if (err){
    //     //                 console.log(err);
    //     //             } else {
    //     //                 console.log("Created Question");
    //     //                 Answer.create({
    //     //                     text: "Test Answer",
    //     //                     author: "Jatong"
    //     //                 }, function(err, answer){
    //     //                     if (err){
    //     //                         console.log(err);
    //     //                     } else {
    //     //                         question.answers.push(answer);
    //     //                         question.save();
    //     //                         console.log("Answer Created");
    //     //                     }
    //     //                 });

    //     //             }
    //     //         });
    //     //     });
    //     // }
    // });
}

module.exports = seedDB;