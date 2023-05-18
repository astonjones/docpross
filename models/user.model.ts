import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'

var User = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   clients: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Client"
      }
   ]
});

User.plugin(passportLocalMongoose);

export default mongoose.model("User", User);