import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import middlewareObj from '../middleware/index.js';
import { batchProcessReceipt } from '../services/azure/processReceipt.js';
import getS3SignedUrl from '../services/aws/s3.js';

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.GOOGLE_PROCESSOR_ID; // Should be a Hexadecimal string
const gcsInputUri = process.env.GCS_INPUT_URI;
const gcsOutputUri = process.env.GCS_OUTPUT_URI;
const processorPath = process.env.GOOGLE_AI_PROCESSOR_PATH;

// --------------- Routes for Azure Services ----------------------------

router.post('/batchProcessReceipt', async (req, res) => {
  try {
    const fileUrls = await getS3SignedUrl(req.body.filenames);
    const documents = await batchProcessReceipt(fileUrls);
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