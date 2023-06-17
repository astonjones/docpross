import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import middlewareObj from '../middleware/index.js';
import { getS3SignedUrls } from '../services/aws/s3.js';
import { batchProcessFromPrebuiltModel } from '../services/azure/batchProcessFromPrebuiltModel.js';
import {  parseExtractedTextResponseToReceiptSchema } from '../parseExtractedText/parseReceipt.js';
import { parseExtractedTextResponseToInvoiceSchema } from '../parseExtractedText/parseInvoice.js';
import { createDocument } from '../db/documentDatabaseOperations.js';

// --------------- Routes for Azure Services ----------------------------

router.post('/batchProcessReceipt', async (req, res) => {
  const directoryPath = 'testOrganization/receipts';
  const azurePreBuiltModel = 'prebuilt-receipt';
  const structuredResponse = [];
  try {
    if(req.body.files === undefined){
      return "No files were selected"
    }
    // returns urls of keys
    const fileUrls = await getS3SignedUrls(directoryPath, req.body.files);
    if(fileUrls.length < 1){
      return "The files you are looking for do not exist"
    }
    console.log('These are the filUrls', fileUrls);
    //processes the documents through azure
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
  const directoryPath = 'testOrganization/invoices';
  const structuredResponse = [];
  try {
    if(req.body.files === undefined){
      return "No files were selected"
    }
    // returns urls of keys
    const fileUrls = await getS3SignedUrls(directoryPath, req.body.files);
    console.log('These are the filUrls', fileUrls);
    if(fileUrls.length < 1){
      return "The files you are looking for do not exist"
    }
    const documents = await batchProcessFromPrebuiltModel(azurePreBuiltModel, fileUrls);
    console.log({level: 'info', message: "Finished processing invoice documents"});

    // iterate through documents and call parseExtractedTextRessponseReceiptSchema
    for (const doc of documents) {
      const parsedDoc = parseExtractedTextResponseToInvoiceSchema(doc);
      structuredResponse.push(parsedDoc);
    }
    console.log({level: 'info', message: "Finished parsing invoice documents"});

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

export default router;