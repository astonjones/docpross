export interface Invoice {
    CustomerName: { value: string, confidence: number };
    CustomerId: { value: string, confidence: number };
    PurchaseOrder: { value: string, confidence: number };
    InvoiceId: { value: string, confidence: number };
    InvoiceDate: { value: Date, confidence: number };
    DueDate: { value: Date, confidence: number };
    VendorName: { value: string, confidence: number };
    VendorTaxId: { value: string, confidence: number };
    VendorAddress: { value: string, confidence: number };
    VendorAddressRecipient: { value: string, confidence: number };
    CustomerAddress: { value: string, confidence: number };
    CustomerTaxId: { value: string, confidence: number };
    CustomerAddressRecipient: { value: string, confidence: number };
    BillingAddress: { value: string, confidence: number };
    BillingAddressRecipient: { value: string, confidence: number };
    ShippingAddress: { value: string, confidence: number };
    ShippingAddressRecipient: { value: string, confidence: number };
    PaymentTerm: { value: string, confidence: number };
    SubTotal: { value: number, confidence: number };
    TotalTax: { value: number, confidence: number };
    InvoiceTotal: { value: number, confidence: number };
    AmountDue: { value: number, confidence: number };
    ServiceAddress: { value: string, confidence: number };
    ServiceAddressRecipient: { value: string, confidence: number };
    RemittanceAddress: { value: string, confidence: number };
    RemittanceAddressRecipient: { value: string, confidence: number };
    ServiceStartDate: { value: Date, confidence: number };
    ServiceEndDate: { value: Date, confidence: number };
    PreviousUnpaidBalance: { value: number, confidence: number };
    CurrencyCode: { value: string, confidence: number };
    PaymentDetails: { value: string, confidence: number }[];
    TotalDiscount: { value: number, confidence: number };
    TaxItems: { value: string, confidence: number }[];
    Items: InvoiceItems[];
}

export interface InvoiceItems {
    Amount: { value: number, confidence: number };
    Description: { value: string, confidence: number };
    Quantity: { value: number, confidence: number };
    UnitPrice: { value: number, confidence: number };
    ProductCode: { value: number, confidence: number };
    Unit: { value: number, confidence: number };
    Date: { value: Date, confidence: number };
    Tax: { value: string, confidence: number }[];
    TaxRate: { value: string, confidence: number }[];
}