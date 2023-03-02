import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'

var UserSchema = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   clients: [mongoose.SchemaTypes.ObjectId]
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);