var express=require("express");
var router=express.Router();
var passport=require("passport");
var Campground=require("../models/campground");
var middleware=require("../middleware");
var Comment=require("../models/comment");


//INDEX--DHOW ALL CAMPGROUNDS
router.get("/",function(req,res){
	//console.log(req.user);
	// res.render("campgrounds",{campgrounds:campgrounds});
	//instead of sending the hard coded array we'll prefer retrieving the data from our data base 
	Campground.find({},function(err,allcamps){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allcamps,currentuser:req.user});
		}
	});
	
	
	
});
//FORM TO ADD NEW DATA
router.get("/new",middleware.isloggedin,function(req,res){
	res.render("campgrounds/new",{currentuser:req.user});
});
//CREATE : TO ADD NEW CAMPGROUND TO DB
router.post("/",middleware.isloggedin,function(req,res){
	//get data from form and add to campgrounds array
	var name=req.body.name;
	var image=req.body.image;
	var des=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
		
	}
	var newcampground={name:name, image:image ,description:des ,author:author,price:price};
	Campground.create(newcampground,function(err,newlycreatedcmpground){
		if(err){
			console.log(err);
		}
		else{
			//redirect to campgrounds page
			res.redirect("/campgrounds");
		}
	});
	
});

//SHOW FOR EACH CAMPGROUND
router.get("/:id",function(req,res){
	// identify the campground using that ide
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
			if(err){
				console.log(err);
			}
		else{
			res.render("campgrounds/show",{campground:foundcampground,currentuser:req.user});
		}
	});
	//req.params.id
	//render the show page having info about that campground
	//res.render("show");
});

//edit campground router
router.get("/:id/edit",middleware.checkcampgroundownership,function(req,res){
		
		Campground.findById(req.params.id,function(err,foundcampground){
			
		res.render("campgrounds/edit",{campground:foundcampground});
		});
	});

//update campground
router.put("/:id",middleware.checkcampgroundownership,function(req,res){
	//find and update the correct campground
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updateduser){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	
	
});
//destroy campgroundroute
router.delete("/:id",middleware.checkcampgroundownership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
	
});


module.exports=router;