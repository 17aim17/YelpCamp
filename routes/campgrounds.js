var express =require("express");
var router =express.Router();
var Campground =require("../models/campgrounds");
var Comment =require("../models/comments");
var middleware =require("../middleware");



// ===========================================
// Routes
// ===========================================

router.get("/campgrounds" ,function(req,res){
    Campground.find({} ,function(err ,allCampgrounds){
      if(err){ console.log(err);}
      else{
        res.render("campgrounds/index" , {campgrounds:allCampgrounds, currentUser : req.user});
      }
    });

});

router.post("/campgrounds" , middleware.isSignedIn ,function(req ,res){
    var author = {
        id :req.user._id,
        username :req.user.username
    }
   Campground.create({name:req.body.name , price:req.body.price ,image:req.body.image , description:req.body.description , author:author}, function(err ,newCampground){
     if(err){ console.log(err);}
     else{
         
       res.redirect("/campgrounds");
     }
   })
});

router.get("/campgrounds/new",middleware.isSignedIn ,function(req,res){
   res.render("campgrounds/new");
});

router.get("/campgrounds/:id" ,function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err ,foundCampground) {
       if(err){ req.flash("error" ,"Something went wrong");}
       else{
          
          res.render("campgrounds/show" , {campground : foundCampground});
       }
    });
});

/*Edit campgrouds routes*/
router.get("/campgrounds/:id/edit" ,middleware.checkCampgroundOwnerShip,function(req, res) {
             Campground.findById(req.params.id ,function(err ,campground){
                 if(err){
                     console.log(err);
                 }else{
                      res.render("campgrounds/edit", {campground :campground}); 
                 }
        });
});

/*Update camproud rotes*/

router.put("/campgrounds/:id" ,middleware.checkCampgroundOwnerShip, function(req ,res){
   // find and update the current
   Campground.findByIdAndUpdate(req.params.id, req.body.campground , function(err , updatedCampground){
      if(err){
          console.log(err);
      } 
      else{
          res.redirect("/campgrounds/"+ updatedCampground._id);
      }
   });
});

// delete route
router.delete("/campgrounds/:id" ,middleware.checkCampgroundOwnerShip, function(req ,res){
   Campground.findByIdAndRemove(req.params.id , function(err){
        if(err){
            req.flash("error" ,"Something went wrong");
            res.redirect("/campgrounds");
        }else{
            req.flash("success" ,"Campground removed Successfully");
            res.redirect("/campgrounds");
        }
   });
});





module.exports =router;