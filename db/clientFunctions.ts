import dotenv from 'dotenv';
dotenv.config();

import clientModel from '../models/mongooseModels/client.model.js';

export const createClient = async (name: string, email: string, address: Object, phone: string) => {
  const client = await clientModel.create({
    name: name,
    email: email,
    address: address,
    phone: phone,
  })
  return client;
}

export const readClient = async (name: string, email: string) => {
  const client = await clientModel.findOne({
    name: name,
    email: email
  })
  return client;
}

export const insertCientDocument = async (email: string, documentId: any) => {
  const client = await clientModel.findOneAndUpdate({email: email}, {$push: {documents: documentId}})
}