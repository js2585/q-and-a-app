var mongoose = require("mongoose");
var Question = require("./models/question");
var Answer = require("./models/answer");
var Course = require("./models/course");

var data = [
    {
        name: "ap world",
    },
    {
        name: "apush",
    },
    {
        name: "ap gov",
    },
    {
        name: "ap euro",
    },
    {
        name: "ap micro",
    },
    {
        name: "ap macro",
    },
    {
        name: "ap psych",
    },
    {
        name: "ap human",
    },
    {
        name: "ap gov",
    },
    {
        name: "world",
    },
    {
        name: "us history",
    },
    {
        name: "econ",
    },
    {
        name: "chinese 1",
    },
    {
        name: "chinese 2",
    },
    {
        name: "chinese 2 honors",
    },
    {
        name: "chinese 3",
    },
    {
        name: "chinese 3 honors",
    },
    {
        name: "chinese 4",
    },
    {
        name: "chinese 4 honors",
    },
    {
        name: "chinese 5 honors",
    },
    {
        name: "ap chinese",
    },
    {
        name: "french 1",
    },
    {
        name: "french 2",
    },
    {
        name: "french 2 honors",
    },
    {
        name: "french 3",
    },
    {
        name: "french 3 honors",
    },
    {
        name: "french 4",
    },
    {
        name: "french 4 honors",
    },
    {
        name: "french 5 honors",
    },
    {
        name: "ap french",
    },
    {
        name: "german 1",
    },
    {
        name: "german 2",
    },
    {
        name: "german 2 honors",
    },
    {
        name: "german 3",
    },
    {
        name: "german 3 honors",
    },
    {
        name: "german 4",
    },
    {
        name: "german 4 honors",
    },
    {
        name: "german 5 honors",
    },
    {
        name: "ap german",
    },
    {
        name: "latin 1",
    },
    {
        name: "latin 2",
    },
    {
        name: "latin 2 honors",
    },
    {
        name: "latin 3",
    },
    {
        name: "latin 3 honors",
    },
    {
        name: "latin 4",
    },
    {
        name: "latin 4 honors",
    },
    {
        name: "ap latin",
    },
    {
        name: "spanish 1",
    },
    {
        name: "spanish 2",
    },
    {
        name: "spanish 2 honors",
    },
    {
        name: "spanish 3",
    },
    {
        name: "spanish 3 honors",
    },
    {
        name: "spanish 4",
    },
    {
        name: "spanish 4 honors",
    },
    {
        name: "spanish 5 honors",
    },
    {
        name: "ap spanish",
    },
    {
        name: "9th lit",
    },
    {
        name: "9th lit honors",
    },
    {
        name: "10th lit",
    },
    {
        name: "10th honors",
    },
    {
        name: "11th lit",
    },
    {
        name: "11th lit honors",
    },
    {
        name: "ap lang",
    },
    {
        name: "ap lit",
    },
    {
        name: "algebra 1",
    },
    {
        name: "algegra 1 honors",
    },
    {
        name: "algegra 2",
    },
    {
        name: "algegra 2 honors",
    },
    {
        name: "precalc",
    },
    {
        name: "precalc honors",
    },
    {
        name: "ab calc",
    },
    {
        name: "bc calc",
    },
    {
        name: "bio",
    },
    {
        name: "honors bio",
    },
    {
        name: "ap bio",
    },
    {
        name: "chem",
    },
    {
        name: "honors chem",
    },
    {
        name: "ap chem",
    },
    {
        name: "physics",
    },
    {
        name: "ap physics 1",
    },
    {
        name: "ap physics c",
    },
    
]

function seedDB(){
    
    // Course.deleteMany({}, function(err){
    //     if (err){
    //         console.log(err);
    //     } else {
    //         data.forEach(function(course){
    //             Course.create(course, function(err, result){
    //                 if (err){
    //                     console.log(err);
    //                 }
    //             });
    //         });
    //     }
    // });
    
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