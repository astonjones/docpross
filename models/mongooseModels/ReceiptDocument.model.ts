import mongoose, { Schema, Document } from 'mongoose';
import { Receipt } from '../ReceiptModel';

const ReceiptSchema: Schema = new Schema({
  status: String, // This flag will determine if it needs human review.
  merchantName: { value: String, confidence: Number },
  merchantPhoneNumber: { value: String, confidence: Number },
  merchantAddress: { value: String, confidence: Number },
  total: { value: Number, confidence: Number },
  transactionDate: { value: Date, confidence: Number },
  transactionTime: { value: Date, confidence: Number },
  subtotal: { value: Number, confidence: Number },
  totalTax: { value: Number, confidence: Number },
  tip: { value: Number, confidence: Number },
  items: [{
    description: { value: String, confidence: Number },
    quantity: { value: Number, confidence: Number },
    price: { value: Number, confidence: Number },
    productCode: { value: String, confidence: Number },
    quantityUnit: { value: String, confidence: Number }
  }],
  confidence: { type: Number }
});

export default mongoose.model<Receipt>('Receipt', ReceiptSchema);