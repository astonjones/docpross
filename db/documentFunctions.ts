import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { DocumentModelOutput, LendingDocumentField } from '../models/documentModels.js';
dotenv.config();

import LendingDocumentSchema from '../models/mongooseModels/document.model.js';

export const createDocument = async (doc: DocumentModelOutput) => {
  const document = await LendingDocumentSchema.create({
    documentType: doc.documentType,
    documentFields: doc.documentFields
  })
  return document;
}

export const readDocumentFromId = async (docId: any) => {
  const document = await LendingDocumentSchema.findOne({
    _id: docId,
  })
  return document;
}