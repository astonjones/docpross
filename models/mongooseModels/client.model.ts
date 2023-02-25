import LendingDocumentSchema from './document.model.js'

var mongoose = require("mongoose");

var ClientSchema = new mongoose.Schema({
   name: String,
   email: String,
   address: String,
   phone: String,
   documents: [LendingDocumentSchema]
});

export default mongoose.model("Client", ClientSchema);