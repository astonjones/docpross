import dotenv from 'dotenv';
import { DocumentModelOutput, LendingDocumentField } from '../models/documentModels.js';
dotenv.config();

import LendingDocumentSchema from '../models/mongooseModels/document.model.js';

export const createDocument = async (doc: DocumentModelOutput) => {
  const document = await LendingDocumentSchema.create({
    document_type: doc.documentType,
    documentFields: doc.documentFields
  })
}

export const readDocumentFromId = async (docId: string) => {
  const document = await LendingDocumentSchema.findOne({
    _id: docId,
  })
  return document;
}