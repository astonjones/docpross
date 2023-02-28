export interface ValueDetectedEntity {
  Text: string;
  Geometry: any; // Not worried about this value
  Polygon: Object[];
  Confidence: number;
}

export interface LendingDocumentField {
  Type: string,
  ValueDetections: ValueDetectedEntity[];
}

export interface LendingDocumentEntity {
  Page: string,
  PageClassification: {
    PageType: {
      Value: string,
      Confidence: number
    }[]
    PageNumber: {
      Value: string,
      Confidence: number
    }[],
  }
  Extractions: {
    LendingDocument: {
      LendingFields: LendingDocumentField[]
    }
  }[]
}

export interface DocumentModelOutput {
  documentType: String, // PageClassification.PageType.Value
  documentFields: []
}