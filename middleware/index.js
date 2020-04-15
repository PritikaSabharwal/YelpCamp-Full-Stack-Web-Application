var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareobj={};
middlewareobj.checkcampgroundownership=function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundcampground){
		if(err){
			res.redirect("back");
			req.flash("error","Campground not found");
		}
		else{
			if(foundcampground.author.id.equals(req.user.id)){
				next();
			}
			else{
				req.flash("error","You don't have permission to do that");
				res.redirect("back");
			}
		}
		
	});
	}
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
};
middlewareobj.checkcommentownership=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundcomment){
		if(err){
			res.redirect("back");
		}
		else{
			if(foundcomment.author.id.equals(req.user.id)){
				next();
			}
			else{
				req.flash("error","You don't have permission to do that");
				res.redirect("back");
			}
		}
		
	});
	}
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
	
}
middlewareobj.isloggedin=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}
module.exports=middlewareobj;