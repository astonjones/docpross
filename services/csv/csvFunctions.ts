// import csv from 'csv-writer';

const documentsToCsv = async (documents, filePath) => {
//   let documentDataArray = documents.map(document => {
//     const documentData = new DocumentDataModel();
//     documentData.convertEntityToDocumentData(document.entities);
//     return documentData;
//   });
//   try {
//     const csvWriter = csv.createObjectCsvWriter({
//       path: filePath,
//       header: Object.keys(documentDataArray[0])
//     });
//     await csvWriter.writeRecords(documentDataArray);
//     console.log({ level: "info", message: `CSV file created at ${filePath}`});
//   } catch (err) {
//     console.error(err);
//   }
}

export default documentsToCsv;