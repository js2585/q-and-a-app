var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express(),
    methodOveride = require("method-override"),
    Question = require("./models/question"),
    Answer = require("./models/answer"),
    seedDB = require("./seed"),
    LocalStrategy = require("passport-local"),
    passport = require("passport"),
    User = require("./models/user");

var PORT = 3001;
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOveride("_method"));
app.use(require("express-session")({
    secret: "Random Sentence 123456",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();
mongoose.connect("mongodb://localhost/parsons_road", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res)=>{
    res.render("landing.ejs");
});

app.get("/questions", isLoggedIn, (req, res)=>{
    Question.find({}, function(err, questions){
        if (err){
            console.log(err);
        } else {
            res.render("questions.ejs", {questions: questions});
        }
    })
});

app.post("/questions", isLoggedIn, (req, res)=>{
    var newQuestion = req.body.q;
    Question.create(newQuestion, function(err, result){
        if (err){
            console.log(err);
        } else {
            res.redirect("/questions");
        }
    })
});

app.get("/questions/ask", isLoggedIn, (req, res)=>{
    res.render("newQuestion.ejs");
});

app.get("/questions/:id", isLoggedIn, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id)).populate("answers").exec(function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("show.ejs", {question: response});
        }
    });
});

app.get("/questions/:id/edit", isLoggedIn, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, response){
        if (err){
            console.log(err);
        } else {
            res.render("edit.ejs", {question: response});
        }
    });
});

app.put("/questions/:id", isLoggedIn, (req, res)=>{
    var newQuestion = req.body.q;
    Question.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), newQuestion, function(err, resonse){
        if (err){
            console.log(err);
        } else {
            res.redirect("/questions/" + req.params.id);
        }
    });
});

app.delete("/questions/:id", isLoggedIn, (req, res)=>{
    Question.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err){
        res.redirect("/questions");
    });
});

app.post("/questions/:id/answers", isLoggedIn, (req, res)=>{
    Question.findById(mongoose.Types.ObjectId(req.params.id), function(err, question){
        if (err){
            console.log(err);
        } else {
            Answer.create({text: req.body.answer, author: "Jatong"}, function(err, ans){
                if (err){
                    console.log(err);
                } else {
                    question.answers.push(ans);
                    question.save();
                    res.redirect("/questions/" + question._id);
                }
            });
        }
    });
});
//Authorization Routes
app.get("/register", (req, res)=>{
    res.render("register.ejs");
});

app.post("/register", (req, res)=>{
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

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/questions",
    failureRedirect: "/login"
}), (req, res)=>{

});

app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, function(){
    console.log("Running on port " + PORT);
});