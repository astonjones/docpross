import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { processDocument, keyValuePairs, batchProcessDocument } from '../services/documentAi/documentProcesses.js';
import documentsToCsv from '../services/csv/csvFunctions.js';
import {v4 as uuidv4} from 'uuid';
import { main } from '../services/textract/processDocuments.js';
import { createDocument, readDocumentFromId } from '../db/documentFunctions.js';
import { DocumentModelOutput } from '../models/documentModels.js';
import { insertClientDocument } from '../db/clientFunctions.js';
import middlewareObj from '../middleware/index.js';

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
 const documentName = "Capital_one_Jan_2023.pdf";
 const roleArn = process.env.TEXTRACT_ROLE
 // Current Types availabld types are: ["LENDER", "DETECTION", "ANALYSIS"]
 const processType = "LENDER"

router.post('/textractProcessSingle', middlewareObj.isLoggedIn, async (req, res) => {
  try{
    // HERE I NEED TO FIND THE USERS CLIENT THEN SEARCH THROUGH THOSE CLIENTS
    if(req.body.clientEmail != null || req.body.clientEmail != undefined){
      // THEN HAVE CONDITIONAL IF CLIENT EXISTS APPEND DOCUMENT TO CLIENT
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

router.post('/findDocument', middlewareObj.isLoggedIn, async (req, res) => {
  try {
    const doc = await readDocumentFromId(req.body.id)
    res.status(200).send(doc);
  } catch (err) {
    res.status(500).send({level: 'error', message: 'Could not find that document by Id.'})
  }
})

export default router;