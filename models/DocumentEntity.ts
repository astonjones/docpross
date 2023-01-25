// this file is a document object.
// This object is returned from the google ai client when processing documents

class DocumentEntity {
  confidence: number;
  id: number;
  mentionText: string;
  pageAnchor: string;
  textAnchor: string;
  type: string;

  constructor(json: any) {
    this.confidence = json.confidence;
    this.id = json.id;
    this.mentionText = json.mentionText;
    this.pageAnchor = json.pageAnchor;
    this.textAnchor = json.textAnchor;
    this.type = json.type;
  }

  getConfidence(): number {
    return this.confidence;
  }
}

export default DocumentEntity;