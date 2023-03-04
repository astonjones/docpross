import express from "express";
const router = express.Router();
import middlewareObj from '../middleware/index.js'
import { createClient, findClient, readClients } from '../db/clientFunctions.js';

router.post('/addClient', middlewareObj.isLoggedIn, async (req, res) => {
try {
    const client = await createClient(req.user._id, req.body.name, req.body.email, req.body.address, req.body.phone);
    res.status(200).send({level: 'info', message: `client ${req.body.name} was created!`})
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Error occured when creating a client!'})
  }
})
  
router.post('/findClients', middlewareObj.isLoggedIn, async (req, res) => {
  try {
    const clients = await readClients(req.user._id);
    if(clients.length > 0 || clients != null){
      res.status(200).send(clients);
    } else if(clients.length === 0){
      res.status(200).send([]);
    } else {
      res.status(404).send({level: 'info', message: 'Error trying to fetch Clients'});
    }
  } catch (err) {
      res.status(500).send({level: 'error', message: 'Error occured finding clients.'})
  }
})

router.post('/findClient', middlewareObj.isLoggedIn, async (req, res) => {
  try {
    const client = await findClient(req.user._id, req.body.name, req.body.email)
    if(client != undefined || client != null){
      res.status(200).send(client);
    } else {
      res.status(404).send({level: 'info', message: 'That client was not found!'});
    }
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Error occured finding a client.'})
  }
})

// router.post('/getClientDocuments', middlewareObj.isLoggedIn, async (req, res) => {
//   try {
//     // perhaps go through the users clients before searching the client??
//     const client = await readClient(req.body.name, req.body.email);
//     const documentIds = await Promise.all(client.documents.map(async obj => await readDocumentFromId(obj._id)));
//     const docs = await Promise.all(documentIds.map(async obj => await readDocumentFromId(obj._id)));
//     if(documentIds.length < 1){
//       res.status(200).send({level: 'info', message:'This client does not have any submitted documents!'});
//     } else {
//       res.status(200).send(docs);
//     }
//   } catch (err) {
//     res.status(500).send({level: 'error', message: 'Error occured finding user.'})
//   }
// })

export default router;
