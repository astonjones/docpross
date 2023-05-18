import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer"
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.FORM_RECOGNIZER_KEY;
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;

// @todo have error handling right here
async function batchProcessReceipt(FileUrlsS3: string[]) {
    const bulkScannedFiles = [];
    try {
        const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
        // create a loop to iterate over FileUrlsS3 and call processSingleReceipt
        for (const FileUrlS3 of FileUrlsS3) {
            const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-receipt", FileUrlS3);
            const { documents: [result] } = await poller.pollUntilDone();
            if (result) {
                // Here I should polish the result & user template is used here
                bulkScannedFiles.push(result.fields);
            } else {
                throw new Error("Expected at least one receipt in the result.");
            }
        }
    } catch (error) { 
        console.log(error)
    }
    return bulkScannedFiles;
}


export { batchProcessReceipt }