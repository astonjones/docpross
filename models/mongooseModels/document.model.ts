import mongoose from "mongoose";

var LendingDocumentSchema = new mongoose.Schema({
   document_type: String,
   document_fields: [{Type: String, Value: String}]
})

export default mongoose.model("LendingDocument", LendingDocumentSchema);