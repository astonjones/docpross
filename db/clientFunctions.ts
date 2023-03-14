import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
// test

import clientModel from '../models/mongooseModels/Client.model.js';
import UserModel from '../models/mongooseModels/User.model.js';

export const createClient = async (userId: mongoose.Types.ObjectId, name: string, email: string, address: Object, phone: string) => {
  const client = await clientModel.create({
    name: name,
    email: email,
    address: address,
    phone: phone,
  });
  await UserModel.updateOne({ _id: userId }, { $push: { clients : client }});
  return client;
}

export const readClients = async (userId) => {
  const user = await UserModel.findOne({ _id: userId }).populate('clients');
  return user.clients;
}

export const findClient = async (userId, name, email) => {
  const clients = await readClients(userId);
  const index = clients.findIndex((elem) => elem.name == name && elem.email == email);
  let foundClient = clients[index];
  return foundClient;
}

export const insertClientDocument = async (email: string, documentId: any) => {
  const client = await clientModel.findOneAndUpdate({email: email}, {$push: {documents: documentId}})
  return client;
}