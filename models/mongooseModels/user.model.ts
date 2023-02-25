import mongoose from "mongoose";
// var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   email: String,
   password: String,
   clients: [mongoose.SchemaTypes.ObjectId]
});

// UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);