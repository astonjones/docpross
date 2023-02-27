import mongoose from "mongoose";

var collection = 'users';

var UserSchema = new mongoose.Schema({
   email: String,
   password: String,
   clients: [mongoose.SchemaTypes.ObjectId]
});

export default mongoose.model("User", UserSchema);