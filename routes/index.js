var express =require("express");
var router =express.Router();
var passport =require("passport");
var User =require("../models/user");
var middleware =require("../middleware");

router.get("/" ,function(req ,res){
  res.render("landing");
});


//===================================
// =========Auth Routes==============

//show register form
router.get("/register" ,function(req, res) {
    res.render("register");
    
})

router.post("/register", function(req,res){
    var newUser =new User({username:req.body.username});
    User.register( newUser , req.body.password ,function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
    }
       passport.authenticate("local")(req,res,function(){
           req.flash("success" ,"Welcome to YelpCamp "+ user.username);
           res.redirect("/campgrounds"); 
       });
    });
});

// ===========login forms============
router.get("/signin", function(req,res){
   res.render("signin"); 
});

router.post("/signin", passport.authenticate("local" ,{ 
    successRedirect : "/campgrounds" ,
    failureRedirecct :"/signin" }) ,
    function(req ,res){}
);
// ============logout ====================
router.get("/signout", middleware.isSignedIn , function(req, res) {
    req.logout();
    req.flash("success","Logged You out");
    res.redirect("/campgrounds");
});

module.exports =router;