var express =require("express");
var router =express.Router();
var Campground =require("../models/campgrounds");
var Comment =require("../models/comments");
var middleware =require("../middleware");

// /=========Adding comments here==============/
router.get("/campgrounds/:id/comments/new" , middleware.isSignedIn, function(req,res){
    //find by id 
    Campground.findById(req.params.id ,function(err ,campground){
        if(err) {
            console.log(err);
        } else{
             res.render("comments/new" , {campground :campground});   
        }
    });
    
});

router.post("/campgrounds/:id/comments", middleware.isSignedIn , function(req ,res){
   //lookup for campground using id
   Campground.findById(req.params.id ,function(err, campground){
       if(err){console.log(err);
           res.redirect("/campgrounds");
       }
       else{
         Comment.create(req.body.comment ,function(err ,comment){
                if(err){ req.flash("error" ,"Something went Wrong");}
                else{
                        //add username and id to comment
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        console.log(comment);
                        req.flash("success" ,"Successfully added comment");
                        res.redirect("/campgrounds/" + campground._id);
                }
         });
       }
   });
   //create new comment
   //connent new comment to camoground
   //redirect to show page
});


// edit comment
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnerShip , function(req ,res){
    Comment.findById(req.params.comment_id , function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
          res.render("comments/edit" ,{campground_id :req.params.id , comment : foundComment});   
        }
    });
   
});

//update comment
router.put("/campgrounds/:id/comments/:comment_id" ,middleware.checkCommentOwnerShip, function(req ,res){
   Comment.findByIdAndUpdate(req.params.comment_id ,req.body.comment , function(err ,updatedComment){
      if(err){
          res.redirect("back");
      } else{
          res.redirect("/campgrounds/"+ req.params.id );
      }
   });
});

//delete comment
router.delete("/campgrounds/:id/comments/:comment_id" ,middleware.checkCommentOwnerShip, function(req ,res){
   Comment.findByIdAndRemove(req.params.comment_id , function(err){
        if(err){
            req.flash("error" ,"Something went wrong");
            res.redirect("/campgrounds/"+ req.params.id);
        }else{
             req.flash("success","Successfully removed comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
   });
});



module.exports =router;