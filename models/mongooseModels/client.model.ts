import LendingDocumentSchema from './LendingDocument.model.js';
import mongoose from "mongoose";

var Client = new mongoose.Schema({
   name: String,
   email: String,
   address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
   },
   phone: String,
   documents: [
      {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "LendingDocument"
      }
   ]
});

export default mongoose.model("Client", Client);