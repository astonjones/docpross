import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.FORM_RECOGNIZER_KEY;
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;

async function batchProcessFromPrebuiltModel(prebuiltModel: string, FileUrlsS3: string[]) {
    const bulkScannedFiles = [];
    try {
        const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
        // create a loop to iterate over FileUrlsS3 and call process Invoice
        for (const FileUrlS3 of FileUrlsS3) {
            const poller = await client.beginAnalyzeDocumentFromUrl(prebuiltModel, FileUrlS3);
            const { documents: [result] } = await poller.pollUntilDone();
            if (result) {
                console.log(result)
                // Here I should polish the result & maybe user templates are used here
                bulkScannedFiles.push(result.fields);
            } else {
                throw new Error("Expected at least one document from input.");
            }
        }
    } catch (error) { 
        console.log(error)
    }
    return bulkScannedFiles;
}

export { batchProcessFromPrebuiltModel }