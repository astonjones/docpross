import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer"
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.FORM_RECOGNIZER_KEY;
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;

async function processSingleReceipt(FileUrlS3: string) {

    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-receipt", FileUrlS3);

    const {
        documents: [result]
    } = await poller.pollUntilDone();

    if (result) {
        // const { MerchantName, Items, Total } = result.fields;

        console.log("result:", result)
        return result.fields;
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }

}

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


export { processSingleReceipt, batchProcessReceipt }