import { Receipt } from "../models/ReceiptModel";

export const parseExtractedTextResponseToReceiptSchema = (documentFields: any): Receipt => {
  // First, parse the basic fields
  const receipt: Receipt = {
    MerchantName: createStringValueConfidenceObject(documentFields.MerchantName),
    MerchantPhoneNumber: createStringValueConfidenceObject(documentFields.MerchantPhoneNumber),
    MerchantAddress: documentFields.MerchantAddress.value,
    Total: createNumberValueConfidenceObject(documentFields.Total),
    TransactionDate: createDateValueConfidenceObject(documentFields.TransactionDate),
    TransactionTime: createDateValueConfidenceObject(documentFields.TransactionTime),
    Subtotal: createNumberValueConfidenceObject(documentFields.Subtotal),
    TotalTax: createNumberValueConfidenceObject(documentFields.TotalTax),
    Tip: createNumberValueConfidenceObject(documentFields.Tip), // If tip is not in the response, handle accordingly
    Items: [], // Items are handled below
    TaxDetails: [], // If you have taxDetails in your response, parse them similar to items
  };

  // Then, handle the array of items
  // Note: Here I am assuming the structure of an item is similar to other fields. 
  // If it's different, you may need to adjust this code.
  if (documentFields.Items) {
    documentFields.Items.values.forEach((item: any) => {
      receipt.Items.push({
        values: {
          description: createStringValueConfidenceObject(item.Description),
          quantity: createNumberValueConfidenceObject(item.Quantity),
          price: createNumberValueConfidenceObject(item.Price),
          productCode: createStringValueConfidenceObject(item.ProductCode),
          quantityUnit: createStringValueConfidenceObject(item.QuantityUnit),
          category: createStringValueConfidenceObject(item.Category),
          totalPrice: createNumberValueConfidenceObject(item.TotalPrice),
        },
      });
    });
  }

  return receipt;
}

function createStringValueConfidenceObject(field: any) {
  console.log('field', field);
  return { value: field ? field.value : '', confidence: field ? field.confidence : 0 };
}

function createNumberValueConfidenceObject(field: any) {
  console.log('field', field)
  return { value: field ? field.value : 0, confidence: field ? field.confidence : 0 };
}

function createDateValueConfidenceObject(field: any) {
  console.log('field', field)
  return { value: field ? new Date(field.value) : null, confidence: field ? field.confidence : 0 };
}