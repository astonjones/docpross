import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose'

import UserModel from '../models/user.model.js';

export const createUser = async (email: string, password: string) => {
  const user = await UserModel.create({
    email: email,
    password: password
  })
  return user;
}

export const readUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({
    email: email,
    password: password
  })
  return user;
}
