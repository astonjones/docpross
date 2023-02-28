import mongoose from "mongoose";

var LendingDocumentSchema = new mongoose.Schema({
   documentType: String, // PageClassification.PageType.Value
   documentFields: [{ // Extractions.LendingDocument.LendingFields
      Type: String,
      Value: String
   }]
})

export default mongoose.model("LendingDocument", LendingDocumentSchema);