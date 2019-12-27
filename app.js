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
var questionRoutes = require("./routes/questions"),
    answerRoutes = require("./routes/answers"),
    indexRoutes = require("./routes/index");
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

// seedDB();
mongoose.connect("mongodb://localhost/parsons_road", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
app.use(questionRoutes);
app.use(answerRoutes);
app.use(indexRoutes);



app.listen(PORT, function(){
    console.log("Running on port " + PORT);
});