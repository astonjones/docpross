import mongoose, { Schema, Document } from 'mongoose';

const ReceiptSchema: Schema = new Schema({
  status: String, // This flag will determine if it needs human review.
  merchantName: { type: String, required: true },
  merchantPhoneNumber: { type: String, required: true },
  merchantAddress: { type: String, required: true },
  total: { type: Number, required: true },
  transactionDate: { type: Date, required: true },
  transactionTime: { type: Date, required: true },
  subtotal: { type: Number, required: true },
  totalTax: { type: Number, required: true },
  tip: { type: Number, required: true },
  items: [{
    description: String,
    quantity: Number,
    price: Number,
    productCode: String,
    quantityUnit: String
  }],
  taxDetails: [{
    amount: Number
  }]
});

export interface Receipt extends Document {
  merchantName: string;
  merchantPhoneNumber: string;
  merchantAddress: string;
  total: number;
  transactionDate: Date;
  transactionTime: Date;
  subtotal: number;
  totalTax: number;
  tip: number;
  items: Item[];
  taxDetails: TaxDetail[];
}

interface Item {
  description: string;
  quantity: number;
  price: number;
  productCode: string;
  quantityUnit: string;
  values: any;
}

interface TaxDetail {
  amount: number;
}

export default mongoose.model<Receipt>('Receipt', ReceiptSchema);