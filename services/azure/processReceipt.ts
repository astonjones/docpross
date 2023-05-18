import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer"
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.FORM_RECOGNIZER_KEY;
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;

// sample document
const receiptURL = "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/main/sdk/formrecognizer/azure-ai-formrecognizer/tests/sample_forms/receipt/contoso-receipt.png"

async function processSingleReceipt() {

    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-receipt", receiptURL);

    const {
        documents: [result]
    } = await poller.pollUntilDone();

    if (result) {
        const {
            MerchantName,
            Items,
            Total
        } = result.fields;

        console.log("result:", result)
        return result;
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }

}


export default processSingleReceipt;