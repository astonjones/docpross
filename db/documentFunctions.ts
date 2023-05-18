import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { Receipt } from '../models/ReceiptDocument.model.js';
dotenv.config();


// @Todo I need to change the input parameter type to something other than any.
// export const createDocument = async (doc: Receipt) => {
//   const document = await LendingDocumentSchema.create({
//     documentType: doc.documentType,
//     documentFields: doc.documentFields
//   })
//   return document;
// }

// export const readDocumentFromId = async (docId: any) => {
//   const document = await LendingDocumentSchema.findOne({
//     _id: docId,
//   })
//   return document;
// }