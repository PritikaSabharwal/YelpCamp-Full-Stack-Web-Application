var mongoose=require("mongoose");
// we are aiming o directly link the comment entered by the user with the account he used for commenting
var commentschema=new mongoose.Schema({
	text:String,
	author:{
		id:  {
			type:  mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}
});
module.exports=mongoose.model("Comment",commentschema);