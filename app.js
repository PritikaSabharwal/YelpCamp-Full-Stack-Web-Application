
var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localstrategy=require("passport-local");
var methodoverride=require("method-override");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var flash=require("connect-flash");
//var passportlocalmongoose=require("passport-local-mongoose");
//var User=require("./models/user");


var seeddb=require("./seeds");
var commentroutes=require("./routes/comments");
var campgroundroutes=require("./routes/campgrounds");
var indexroutes=require("./routes/index");

//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
mongoose.connect("mongodb+srv://pritika:pritika20@cluster0-ongjw.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true}).then(()=>{
	console.log("connected to db");
}).catch(err=>{
	console.log("error:",err.message);
});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodoverride("_method"));
app.use(flash());
//seeddb();//seed the database


//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"rusty win",
	resave: false,
	saveUnitialized:false
	
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=====================================
app.use(function(req,res,next){
	res.locals.currentuser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
app.use(indexroutes);
app.use("/campgrounds",campgroundroutes);
app.use("/campgrounds/:id/comments",commentroutes);



app.listen(3000, function() {
 console.log('Server listening on port 3000');
});