import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import middlewareObj from '../middleware/index.js';
import getS3SignedUrl from '../services/aws/s3.js';
import { batchProcessFromPrebuiltModel } from '../services/azure/batchProcessFromPrebuiltModel.js';
import { parseExtractedTextResponseToReceiptSchema } from '../parseExtractedText/parseReceipt.js';
import { createDocument } from '../db/documentDatabaseOperations.js';

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string
const gcsInputUri = process.env.GCS_INPUT_URI;
const gcsOutputUri = process.env.GCS_OUTPUT_URI;
const processorPath = process.env.GOOGLE_AI_PROCESSOR_PATH;

// --------------- Routes for Azure Services ----------------------------

router.post('/batchProcessReceipt', async (req, res) => {
  const azurePreBuiltModel = 'prebuilt-receipt';
  const structuredResponse = [];
  try {
    const fileUrls = await getS3SignedUrl(req.body.filenames);
    const documents = await batchProcessFromPrebuiltModel(azurePreBuiltModel, fileUrls);

    // iterate through documents and call parseExtractedTextRessponseReceiptSchema
    for (const doc of documents) {
      const parsedDoc = parseExtractedTextResponseToReceiptSchema(doc);
      structuredResponse.push(parsedDoc);
    }
    
    if(!structuredResponse.length){
      res.status(404).send({message: "There is no extracted data for this document."})
    } else {
      console.log('Structured Response:', structuredResponse);

      // Wait for all documents to be created
      await Promise.all(structuredResponse.map(async (item) => {
        await createDocument(item);
      }));

      // Send structured response
      res.status(200).send(structuredResponse);
    }
  } catch (err) {
    console.log({level: 'error', message: err})
    res.status(500).send({message: 'Internal Server Error'});
  }
})

router.post('/batchProcessInvoice', async (req, res) => {
  const azurePreBuiltModel = 'prebuilt-invoice';
  try {
    const fileUrls = await getS3SignedUrl(req.body.filenames);
    const documents = await batchProcessFromPrebuiltModel(azurePreBuiltModel, fileUrls);
    // const parseInvoice = await parseInvoice(documents);

    // Here I should probably send the documents to the database
    // I also need to send less confident document to another db/collection/queue for human review
    res.status(200).send(documents);
  } catch (err) {
    console.log({level: 'error', message: err})
    res.status(500).send({message: 'Internal Server Error'});
  }
})

// This file gets the signed url from s3 of a file name in the request body
router.post('/gets3file', async (req, res) => {
  try {
    if(req.body){
      console.log(req.body.filename);
      const fileurl = await getS3SignedUrl(req.body.filename);
      res.status(200).send(fileurl);
    }
    throw console.error('no specified file name');
    
  } catch (err){
    console.log({level: 'error', message: err})
  }
})

export default router;