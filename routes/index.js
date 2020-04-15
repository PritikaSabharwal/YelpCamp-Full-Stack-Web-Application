var express=require("express");
var router=express.Router();
var passport=require("passport");
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var User=require("../models/user");

router.get("/",function(req,res){
	res.render("landingpage",{currentuser:req.user});
});

//AUTH ROUTES
router.get("/register",function(req,res){
	res.render("register",{currentuser:req.user});
})
router.post("/register",function(req,res){
	 var newuser= new User({username:req.body.username});
	 User.register(newuser,req.body.password,function(err,user){
	 if(err){
		 req.flash("error",err.message);
		
  return res.redirect("/register");

	 //console.log(err);
	 return res.render("register",{currentuser:req.user});
	 }
	 passport.authenticate("local")(req,res,function(){
		 req.flash("success","Welcometo the Yelpcamp"+user.username);
	 res.redirect("/campgrounds");
	 });
	 });
	 
 });
//show login

router.get("/login",function(req,res){
	res.render("login",{currentuser:req.user});
})
//login setup
router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login"}),function(req,res){
	res.send("helloo");
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged you out");
	res.redirect("/campgrounds")
});
function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports=router;