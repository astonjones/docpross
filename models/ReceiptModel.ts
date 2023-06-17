export interface Receipt {
  MerchantName?: { value: string, confidence: number  };
  MerchantPhoneNumber?: { value: string, confidence: number  };
  MerchantAddress?: { 
    houseNumber?: string,
    road?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    streetAddress?: string,
    unit?: string
  };
  Total?: { value: number, confidence: number  };
  TransactionDate?: { value: Date, confidence: number  };
  TransactionTime?: { value: Date, confidence: number  };
  Subtotal?: { value: number, confidence: number  };
  TotalTax?: { value: number, confidence: number  };
  Tip?: { value: number, confidence: number  };
  Items?: Item[];
  TaxDetails?: TaxDetail[];
}

// I think I need to nest these attributes under Item.values:
interface Item {
  values: {
    description?: { value: string, confidence: number  };
    quantity?: { value: number, confidence: number  };
    price?: { value: number, confidence: number  };
    productCode?: { value: string, confidence: number  };
    quantityUnit?: { value: string, confidence: number  };
    category?: { value: string, confidence: number  };
    totalPrice?: { value: number, confidence: number  };
  }
}
  
interface TaxDetail {
  amount?: { value: number, confidence: number  };
}