import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { processDocument, keyValuePairs, batchProcessDocument } from '../services/documentAi/documentProcesses.js';
import documentsToCsv from '../services/csv/csvFunctions.js';
import {v4 as uuidv4} from 'uuid';
import middlewareObj from '../middleware/index.js';
import processSingleReceipt from '../services/azure/processReceipt.js';
import getS3SignedUrl from '../services/aws/s3.js';

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string
const gcsInputUri = process.env.GCS_INPUT_URI;
const gcsOutputUri = process.env.GCS_OUTPUT_URI;
const processorPath = process.env.GOOGLE_AI_PROCESSOR_PATH;

// --------------- Routes for Azure Services ----------------------------

router.post('/processReceipt', async (req, res) => {
  try { 
    const document = await processSingleReceipt();
    res.status(200).send(document);
  } catch (err) {
    console.log({level: 'error', message: err})
    res.status(500).send({message: 'Internal Server Error'});
  }
})

router.post('/gets3file', async (req, res) => {
  try {
    if(req.filename){
      const fileurl = getS3SignedUrl(req.body.filename);
      console.log('req.body.filename: ', req.body)
      // deepcode ignore XSS: <please specify a reason of ignoring this>
      res.status(200).send(fileurl);
    }
    throw console.error('no specified file name');
    
  } catch (err){
    console.log({level: 'error', message: err})
  }
})

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

export default router;