var express  = require('express') ,
        app  = express(),
   mongoose  = require('mongoose'),
  bodyParser = require('body-parser'),
  seedDB     = require("./seeds"),
  passport   =  require("passport"),
  localStrategy =require("passport-local"),
   methodOverride = require("method-override"),
   flash        =  require("connect-flash");
   
  
  
  
  
  //node seedDB();
// all routes config here
var commentRoutes =require("./routes/comments");
var campgroundsRoutes =require("./routes/campgrounds");
var indexRoutes =require("./routes/index");

  //Schema Stup
var User       = require("./models/user.js");
var Campground = require('./models/campgrounds.js');
var Comment    = require('./models/comments.js');

  
//=======Passport configuration=============
app.use(require("express-session")({
    secret  :"Hermione Granger",
    resave :false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
//important to reading and encodeing and decoding sessions
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
 
  
  
mongoose.connect("mongodb://localhost/yelp_camp");
app.set('view engine' ,"ejs");
app.use(bodyParser.urlencoded({extended :true }));
app.use(express.static(__dirname +"/public"));

// to check if user is signed in or not and updating the navbar instaedd of adding currentUser in allroures as /campgrounds we use middeware this
app.use(function(req ,res ,next){
    res.locals.currentUser =req.user;
    res.locals.error =req.flash("error");
    res.locals.success =req.flash("success");
    next();
});


app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);



app.listen(process.env.PORT , process.env.IP ,function(){
  console.log("Server started at port 3000");
});
