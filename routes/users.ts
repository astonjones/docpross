import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { createUser, readUser } from '../db/userFunctions.js';

router.post('/addUser', async (req, res) => {
  try{
    await createUser(req.body.email, req.body.password)
    res.status(200).send({level: 'info', message: `user ${req.body.email} was created!`})
  } catch(err) {
    res.status(500).send({level: 'error', message: 'Error occured when creating a user.'})
  }
})
  
router.post('/findUser', async (req, res) => {
  try {
    const user = await readUser(req.body.email, req.body.password)
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Error occured finding user.'})
  }
})

export default router