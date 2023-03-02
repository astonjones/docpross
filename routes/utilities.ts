import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { processDocument, keyValuePairs, batchProcessDocument } from '../services/documentAi/documentProcesses.js';
import documentsToCsv from '../services/csv/csvFunctions.js';
import {v4 as uuidv4} from 'uuid';
import { main } from '../services/textract/processDocuments.js';
import { createUser, readUser } from '../db/userFunctions.js';
import { createClient, insertClientDocument, readClient } from '../db/clientFunctions.js';
import { createDocument, readDocumentFromId } from '../db/documentFunctions.js';
import { DocumentModelOutput } from '../models/documentModels.js';
import middlewareObj from '../middleware/index.js'

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string
const gcsInputUri = process.env.GCS_INPUT_URI;
const gcsOutputUri = process.env.GCS_OUTPUT_URI;
const processorPath = process.env.GOOGLE_AI_PROCESSOR_PATH;

// --------------- ROUTES FOR GOOGLE DOCUMENT AI -----------------------

router.post('/processDocument', async (req, res) => {
  // Supported File Types
  // https://cloud.google.com/document-ai/docs/processors-list#processor_form-parser
  const filePath = './doc_test.pdf'; // The local file in your current working directory
  const mimeType = 'application/pdf';

  try{
    const document = await processDocument(projectId, location, processorId, filePath, mimeType);
    const keyValues = await keyValuePairs(document)
    // Here we should give out only the key value pairs
    res.status(200).send(keyValues);
  } catch(err) {
    console.log(err.statusDetails);
    res.status(500).send({message: 'Internal Server Error!'});
  }

})

router.post('/batchProcess', async (req, res) => {
  const gcsOutputUriPrefix = uuidv4();
  try{
    const documents = await batchProcessDocument(processorPath, gcsInputUri, gcsOutputUri, gcsOutputUriPrefix);
    await documentsToCsv(documents, './Foreclosure.csv');
    res.status(200).send({message: 'Data has been written to a csv file!'});
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
})

// ---------------------  END OF GOOGLE DOCUMENT AI ROUTES -------------------------

 // Set bucket and video variables for AWS resources
 const bucket = process.env.AWS_S3_INPUT_BUCKET;
 const documentName = "PRNW2_2021.pdf";
 const roleArn = process.env.TEXTRACT_ROLE
 // Current Types availabld types are: ["LENDER", "DETECTION", "ANALYSIS"]
 const processType = "LENDER"

 // pass documents to a client
router.post('/textractProcessSingle', middlewareObj.isLoggedIn, async (req, res) => {
  try{
    // Here we should get the client and then insert documents for a specific client
    if(req.body.clientEmail != null || req.body.clientEmail != undefined){
      // Maybe I should find the client before scanning the document
      // const client = await readClient(req.body.name, req.body.email)
      const response: DocumentModelOutput[] = await main(processType, bucket, documentName, roleArn);
      response.forEach(async (item) => {
        var result = await createDocument(item)
        await insertClientDocument(req.body.clientEmail, result._id);
      })
      res.status(200).send({level: 'info', message: 'Document(s) have been inserted in the DB'});
    } else {
      res.status(200).send({level: 'info', message: 'Error with the input parameters'});
    }
  } catch(err) {
    console.log({level: 'error', message: `Internal Server error processing aws textract.`});
    res.status(500).send(err);
  }
})

// ------------------- DB Routes ---------------------

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

router.post('/addClient', middlewareObj.isLoggedIn, async (req, res) => {
  try {
    const client = await createClient(req.body.name, req.body.email, req.body.address, req.body.phone);
    res.status(200).send({level: 'info', message: `client ${req.body.name} was created!`})
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Error occured when creating a client!'})
  }
})

router.post('/findClient', middlewareObj.isLoggedIn, async (req, res) => {
  try {
    const client = await readClient(req.body.name, req.body.email)
    if(client != undefined || client != null){
      res.status(200).send(client);
    } else {
      res.status(404).send({level: 'info', message: 'That client was not found!'});
    }
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Error occured finding user.'})
  }
})

router.post('/getClientDocuments', middlewareObj.isLoggedIn, async (req, res) => {
  try {
    // perhaps go through the users clients before searching the client??
    const client = await readClient(req.body.name, req.body.email);
    const documentIds = await Promise.all(client.documents.map(async obj => await readDocumentFromId(obj._id)));
    const docs = await Promise.all(documentIds.map(async obj => await readDocumentFromId(obj._id)));
    if(documentIds.length < 1){
      res.status(200).send({level: 'info', message:'This client does not have any submitted documents!'});
    } else {
      res.status(200).send(docs);
    }
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Error occured finding user.'})
  }
})

router.post('/findDocument', middlewareObj.isLoggedIn, async (req, res) => {
  try {
    const doc = await readDocumentFromId(req.body.id)
    res.status(200).send(doc);
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Could not find that document by Id.'})
  }
})

export default router;