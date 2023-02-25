import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose'
// import { MongoClient } from "mongodb"

import UserModel from '../models/mongooseModels/user.model.js';
import LendingDocumentSchema from '../models/mongooseModels/document.model.js';
import clientModel from '../models/mongooseModels/client.model.js';

// Connection URI
const uri = process.env.MONGO_URI;
mongoose.set("strictQuery", false);
mongoose.connect(uri + '/users')

export const createUser = async (email: string, password: string) => {
  const user = await UserModel.create({
    email: email,
    password: password
  })
  user.save();
}

export const readUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({
    email: email,
    password: password
  })
  return user;
}

export const dbHealthCheck = async () => {
  try {
    await mongoose.connect(uri);
    return
  } catch(err){
    return err;
  } finally {
    await mongoose.disconnect();
  }
}
