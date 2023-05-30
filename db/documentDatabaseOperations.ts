import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { Receipt } from '../models/ReceiptModel.js';
import ReceiptDocumentModel from '../models/mongooseModels/ReceiptDocument.model.js';
dotenv.config();


export const createDocument = async (document: Receipt) => {
  const doc = await ReceiptDocumentModel.create(document);
  return doc;
}

export const readDocumentFromId = async (documentIdInput: any) => {
  const document = await ReceiptDocumentModel.findOne({
    _id: documentIdInput,
  })
  return document;
}