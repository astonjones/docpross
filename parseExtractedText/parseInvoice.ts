import { Invoice } from "../models/InvoiceModel";

export const parseExtractedTextResponseToInvoiceSchema = (documentFields: any): Invoice => {
  // First, parse the basic fields
  const invoice: Invoice = {
    CustomerName: createStringValueConfidenceObject(documentFields.CustomerName),
    CustomerId: createStringValueConfidenceObject(documentFields.CustomerId),
    PurchaseOrder: createStringValueConfidenceObject(documentFields.PurchaseOrder),
    InvoiceId: createStringValueConfidenceObject(documentFields.InvoiceId),
    InvoiceDate: createDateValueConfidenceObject(documentFields.InvoiceDate),
    DueDate: createDateValueConfidenceObject(documentFields.DueDate),
    VendorName: createStringValueConfidenceObject(documentFields.VendorName),
    VendorTaxId: createStringValueConfidenceObject(documentFields.VendorTaxId),
    VendorAddress: createStringValueConfidenceObject(documentFields.VendorAddress),
    VendorAddressRecipient: createStringValueConfidenceObject(documentFields.VendorAddressRecipient),
    CustomerAddress: createStringValueConfidenceObject(documentFields.CustomerAddress),
    CustomerTaxId: createStringValueConfidenceObject(documentFields.CustomerTaxId),
    CustomerAddressRecipient: createStringValueConfidenceObject(documentFields.CustomerAddressRecipient),
    BillingAddress: createStringValueConfidenceObject(documentFields.BillingAddress),
    BillingAddressRecipient: createStringValueConfidenceObject(documentFields.BillingAddressRecipient),
    ShippingAddress: createStringValueConfidenceObject(documentFields.ShippingAddress),
    ShippingAddressRecipient: createStringValueConfidenceObject(documentFields.ShippingAddressRecipient),
    PaymentTerm: createStringValueConfidenceObject(documentFields.PaymentTerm),
    SubTotal: createNumberValueConfidenceObject(documentFields.SubTotal),
    TotalTax: createNumberValueConfidenceObject(documentFields.TotalTax),
    InvoiceTotal: createNumberValueConfidenceObject(documentFields.InvoiceTotal),
    AmountDue: createNumberValueConfidenceObject(documentFields.AmountDue),
    ServiceAddress: createStringValueConfidenceObject(documentFields.ServiceAddress),
    ServiceAddressRecipient: createStringValueConfidenceObject(documentFields.ServiceAddressRecipient),
    RemittanceAddress: createStringValueConfidenceObject(documentFields.RemittanceAddress),
    RemittanceAddressRecipient: createStringValueConfidenceObject(documentFields.RemittanceAddressRecipient),
    ServiceStartDate: createDateValueConfidenceObject(documentFields.ServiceStartDate),
    ServiceEndDate: createDateValueConfidenceObject(documentFields.ServiceEndDate),
    PreviousUnpaidBalance: createNumberValueConfidenceObject(documentFields.PreviousUnpaidBalance),
    CurrencyCode: createNumberValueConfidenceObject(documentFields.CurrencyCode),
    // @ Todo -- I need to make sure that there isn't any overwrite, and
    // that I am inserting these into an array correctly
    PaymentDetails: [createStringValueConfidenceObject(documentFields.PaymentDetails)],
    TotalDiscount: createNumberValueConfidenceObject(documentFields.TotalDiscount),
    // @ Todo -- I need to make sure that there isn't any overwrite, and
    // that I am inserting these into an array correctly
    TaxItems: [createNumberValueConfidenceObject(documentFields.TaxItems)],
    Items: []
  };

  // Then, handle the array of items
  // Note: Here I am assuming the structure of an item is similar to other fields. 
  // If it's different, you may need to adjust this code.
  if (documentFields.Items) {
    documentFields.Items.values.forEach((item: any) => {
      invoice.Items.push({
          Amount: createNumberValueConfidenceObject(item.Amount),
          Description: createStringValueConfidenceObject(item.Description),
          Quantity: createNumberValueConfidenceObject(item.Quantity),
          UnitPrice: createNumberValueConfidenceObject(item.UnitPrice),
          ProductCode: createNumberValueConfidenceObject(item.ProductCode),
          Unit: createNumberValueConfidenceObject(item.Unit),
          Date: createDateValueConfidenceObject(item.Date),
          // @Todo -- I need to make sure that there isn't any overwrite, and
          // that I am inserting these into an array correctly
          Tax: [createStringValueConfidenceObject(item.Tax)],
          TaxRate: [createStringValueConfidenceObject(item.TaxRate)]
      });
    });
  }

  return invoice;
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