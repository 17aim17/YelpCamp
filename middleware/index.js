// all middleware goes here
var Campground =require("../models/campgrounds");
var Comment =require("../models/comments");
var middlewareObj ={};

middlewareObj.checkCampgroundOwnerShip = function(req ,res ,next){
       //  is user logged in at all
        if(req.isAuthenticated()){
             Campground.findById(req.params.id ,function(err ,campground){
                if(err){
                    req.flash("error" ,"Campground Not Found");
                    res.redirect("back");
                }else{ 
                    if(!campground){
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                      //does user own the campground??
                      if(campground.author.id.equals(req.user._id)){
                         next();
                      }else{
                           // other wise redirect
                           req.flash("error", "You do not have permission have to do that");
                           res.redirect("back");
                      }
                }
            });
        }else{
        req.flash("error" ,"You need to be logged in to do that");
           res.redirect("back");
        }
       
}

middlewareObj.checkCommentOwnerShip =function (req ,res ,next){
       //  is user logged in at all
        if(req.isAuthenticated()){
             Comment.findById(req.params.comment_id ,function(err ,comment){
                if(err){
                    req.flash("error" ,"Comment Not Found");
                    res.redirect("back");
                }else{ 
                      //does user own the campground??
                      if(comment.author.id.equals(req.user._id)){
                         next();
                      }else{
                           // other wise redirect
                           req.flash("error", "You do not have permission have to do that");
                           res.redirect("back");
                      }
                }
            });
        }else{
            req.flash("error" ,"You need to be logged in to do that");
           res.redirect("back");
        }
       
}

middlewareObj.isSignedIn =function (req ,res ,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error" ,"You need to be logged in first");
    res.redirect("/signin");
}



module.exports = middlewareObj;