export interface LendingDocumentResponse {
  documentType: {
    type: string,
    Confidence: number
  },
  extractedValues:{
    Type: string,
    Value: string,
    Confidence: number
  }[]
}

// export class LendingDocumentResponse {
//   constructor(){

//   }
// }