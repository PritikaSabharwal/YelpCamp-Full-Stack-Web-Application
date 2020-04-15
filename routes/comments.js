var express=require("express");
var router=express.Router({mergeParams:true});
var passport=require("passport");
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware/");

router.get("/new", middleware.isloggedin,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground,currentuser:req.user});
		}
	});
	
});

router.post("/",middleware.isloggedin,function(req,res){
	//lookup camp uing id
	//create a new comments
	//connect campground to comments
	//redirect somewhere
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
					req.flash("error","Something went wrong");
				}
				else{
					//add username and id to thecomment 
					//save thecomment
					//explanation:middleware shows that a user is currently logged in and we know that req.user gives info 						//about the currently logged in user
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			});
			
			
			
		}
	});
});
//edit route for comments
router.get("/:comment_id/edit",middleware.checkcommentownership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,comment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit",{campground_id:req.params.id, comment:comment});
		}
	})
	
});
//update route for comments
router.put("/:comment_id",middleware.checkcommentownership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id)
		}
		
	});
});

//delete comment router
router.delete("/:comment_id",middleware.checkcommentownership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","Comment deleted successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});


module.exports=router;