import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { processDocument, keyValuePairs, batchProcessDocument } from '../services/documentAi/documentProcesses.js';
import documentsToCsv from '../services/csv/csvFunctions.js';
import {v4 as uuidv4} from 'uuid';
import { main } from '../services/textract/processDocuments.js';

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string
const gcsInputUri = process.env.GCS_INPUT_URI;
const gcsOutputUri = process.env.GCS_OUTPUT_URI;
const processorPath = process.env.GOOGLE_AI_PROCESSOR_PATH;

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

 // Set bucket and video variables for AWS resources
 const bucket = process.env.AWS_S3_INPUT_BUCKET;
 const documentName = "PRNW2_2021.pdf";
 const roleArn = process.env.TEXTRACT_ROLE
 // Current Types availabld types are: ["LENDER", "DETECTION", "ANALYSIS"]
 const processType = "LENDER"

router.post('/textractProcessSingle', async (req, res) => {
  console.log('s3 bucket name is:', bucket);
  try{
    const response = await main(processType, bucket, documentName, roleArn);
    res.status(200).send({level: 'info', message: 'document successfully processed'});
  } catch(err) {
    console.log({level: 'error', message: `Internal Server error processing aws textract. Error: ${err}`});
    res.status(500).send(err);
  }
})

export default router;