import LendingDocumentSchema from './document.model.js';
import mongoose from "mongoose";

var ClientSchema = new mongoose.Schema({
   name: String,
   email: String,
   address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
   },
   phone: String,
   documents: [mongoose.SchemaTypes.ObjectId]
});

export default mongoose.model("Client", ClientSchema);