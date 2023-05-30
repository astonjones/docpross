// import mongoose, { Schema } from 'mongoose';

// const invoiceSchema = new Schema({
//     CustomerName: String,
//     CustomerId: String,
//     PurchaseOrder: String,
//     InvoiceId: String,
//     InvoiceDate: Date,
//     DueDate: Date,
//     VendorName: String,
//     VendorTaxId: String,
//     VendorAddress: String,
//     VendorAddressRecipient: String,
//     CustomerAddress: String,
//     CustomerTaxId: String,
//     CustomerAddressRecipient: String,
//     BillingAddress: String,
//     BillingAddressRecipient: String,
//     ShippingAddress: String,
//     ShippingAddressRecipient: String,
//     PaymentTerm: String,
//     SubTotal: Number,
//     TotalTax: Number,
//     InvoiceTotal: Number,
//     AmountDue: Number,
//     ServiceAddress: String,
//     ServiceAddressRecipient: String,
//     RemittanceAddress: String,
//     RemittanceAddressRecipient: String,
//     ServiceStartDate: Date,
//     ServiceEndDate: Date,
//     PreviousUnpaidBalance: Number,
//     CurrencyCode: String,
//     PaymentDetails: [String],
//     TotalDiscount: Number,
//     TaxItems: [String],
//   });
  
//   const Invoice = mongoose.model<Invoice>('Invoice', invoiceSchema);
  
//   export default Invoice;