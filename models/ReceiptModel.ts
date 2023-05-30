export interface Receipt {
  merchantName?: { value: string, confidence: number  };
  merchantPhoneNumber?: { value: string, confidence: number  };
  merchantAddress?: { 
    houseNumber?: string,
    road?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    streetAddress?: string,
    unit?: string
  };
  total?: { value: number, confidence: number  };
  transactionDate?: { value: Date, confidence: number  };
  transactionTime?: { value: Date, confidence: number  };
  subtotal?: { value: number, confidence: number  };
  totalTax?: { value: number, confidence: number  };
  tip?: { value: number, confidence: number  };
  items?: Item[];
  taxDetails?: TaxDetail[];
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