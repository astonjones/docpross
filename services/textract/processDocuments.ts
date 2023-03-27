import { CreateQueueCommand,
  GetQueueAttributesCommand,
  GetQueueUrlCommand, 
  SetQueueAttributesCommand,
  DeleteQueueCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from  "@aws-sdk/client-sqs";
import { CreateTopicCommand, SubscribeCommand, DeleteTopicCommand } from "@aws-sdk/client-sns";
import  { SQSClient } from "@aws-sdk/client-sqs";
import  { SNSClient } from "@aws-sdk/client-sns";
import  {
  TextractClient,
  StartDocumentTextDetectionCommand,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
  GetDocumentTextDetectionCommand,
  GetLendingAnalysisCommand,
  GetLendingAnalysisSummaryCommand,
  StartLendingAnalysisCommand,
  DocumentMetadata
} from "@aws-sdk/client-textract";
import { SageMakerA2IRuntimeClient, DeleteHumanLoopCommand, StartHumanLoopCommand  } from "@aws-sdk/client-sagemaker-a2i-runtime";
import { stdout } from "process";
import {
  DocumentModelOutput,
  LendingDocumentEntity,
  LendingDocumentField,
  ValueDetectedEntity
 } from "../../models/documentModels";
 import { LendingDocumentResponse } from "../../models/apiResponseModels";

// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create SNS service object.
const sqsClient = new SQSClient({ region: REGION });
const snsClient = new SNSClient({ region: REGION });
const textractClient = new TextractClient({ region: REGION });
const a2iRuntimeClient = new SageMakerA2IRuntimeClient({ region: "us-east-1" });

var startJobId = ""

var ts = Date.now();
const snsTopicName = "AmazonTextractExample" + ts;
const snsTopicParams = {Name: snsTopicName}
const sqsQueueName = "AmazonTextractQueue-" + ts;

 // Set the parameters for SQS
const sqsParams = {
  QueueName: sqsQueueName, //SQS_QUEUE_URL
  Attributes: {
    DelaySeconds: "60", // Number of seconds delay.
    MessageRetentionPeriod: "86400", // Number of seconds delay.
  },
};
 
// Process a document based on operation type
const processDocument = async (type, bucket, videoName, roleArn, sqsQueueUrl, snsTopicArn) => {
  try {
    // Set job found and success status to false initially
    var jobFound = false
    var succeeded = false
    var dotLine = 0
    var processType = type
    var validType = false

    if (processType == "DETECTION"){
      var response = await textractClient.send(new StartDocumentTextDetectionCommand(
      {
        DocumentLocation:{
          S3Object:{
            Bucket:bucket,
            Name:videoName
          }
        },
        NotificationChannel:{
          RoleArn: roleArn,
          SNSTopicArn: snsTopicArn
        }
      }))
      console.log({level: 'info', message: 'Processing type: Detection'})
      validType = true
    }

    if (processType == "ANALYSIS"){
      var response = await textractClient.send(new StartDocumentAnalysisCommand(
      {
        DocumentLocation:{
          S3Object:{
            Bucket:bucket,
            Name:videoName
          }
        }, 
        NotificationChannel:{
        RoleArn: roleArn,
        SNSTopicArn: snsTopicArn
      },
      FeatureTypes: ["FORMS", "TABLES"]
    }))
      console.log({level: 'info', message: 'Processing type: Analysis'})
      validType = true
    }

    if(processType == "LENDER"){
      var response = await textractClient.send(new StartLendingAnalysisCommand(
      {
        DocumentLocation:{
          S3Object:{
            Bucket:bucket,
            Name:videoName
          }
        },
        NotificationChannel:{
        RoleArn: roleArn,
        SNSTopicArn: snsTopicArn
        }
      }))
      console.log({level: 'info', message: 'Processing type: Lending Analysis'})
      validType = true
    }

    if (validType == false){
    console.log({level: 'warn', message: 'Invalid processing type. Choose Detection or Analysis.'})
    return
    }
    // while not found, continue to poll for response
    console.log({level: 'info', message: `Start Job ID: ${response.JobId}`})
    while (jobFound == false){
      var sqsReceivedResponse = await sqsClient.send(new ReceiveMessageCommand({QueueUrl:sqsQueueUrl, MaxNumberOfMessages:10}));
      if (sqsReceivedResponse){
       var responseString = JSON.stringify(sqsReceivedResponse)
        if (!responseString.includes('Body')){
          if (dotLine < 40) {
            console.log('.')
            dotLine = dotLine + 1
          } else {
            console.log('')
            dotLine = 0
          };
          stdout.write('', () => {
            console.log('');
          });
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue
        }
      }

       // Once job found, log Job ID and return true if status is succeeded
      for (var message of sqsReceivedResponse.Messages){
        var notification = JSON.parse(message.Body)
        var rekMessage = JSON.parse(notification.Message)
        // var messageJobId = rekMessage.JobId
        if (String(rekMessage.JobId).includes(String(startJobId))){
          console.log({ level: 'info', message: `Matching job found: ${rekMessage.JobId}`})
          jobFound = true
          // GET RESULTS FUNCTION HERE
          var operationResults = await GetResults(processType, rekMessage.JobId)
          // console.log(rekMessage.Status)
        if (String(rekMessage.Status).includes(String("SUCCEEDED"))){
          succeeded = true
          console.log({level: 'info', message: 'Job processing succeeded.'})
          var sqsDeleteMessage = await sqsClient.send(new DeleteMessageCommand({QueueUrl:sqsQueueUrl, ReceiptHandle:message.ReceiptHandle}));
        }
        } else {
          console.log({level: 'warn', message: 'Provided Job ID did not match returned ID.'})
          var sqsDeleteMessage = await sqsClient.send(new DeleteMessageCommand({QueueUrl:sqsQueueUrl, ReceiptHandle:message.ReceiptHandle}));
        }
      }
      console.log({level: 'info', message: "Done!"})
    }
  } catch (err) {
    console.log({level: 'error', message: `Error occurred in processDocument function`});
    console.log(err);
    return [];
  }
  return operationResults;
}

 // Create the SNS topic and SQS Queue
const createTopicandQueue = async () => {
  try {
    // Create SNS topic
    const topicResponse = await snsClient.send(new CreateTopicCommand(snsTopicParams));
    const topicArn = topicResponse.TopicArn
    console.log({level: 'info', message: `Success creating sns topic`});
    // Create SQS Queue
    const sqsResponse = await sqsClient.send(new CreateQueueCommand(sqsParams));
    console.log({ level: 'info', message: `Success creating SQS queue`});
    const sqsQueueCommand = await sqsClient.send(new GetQueueUrlCommand({QueueName: sqsQueueName}))
    const sqsQueueUrl = sqsQueueCommand.QueueUrl
    const attribsResponse = await sqsClient.send(new GetQueueAttributesCommand({QueueUrl: sqsQueueUrl, AttributeNames: ['QueueArn']}))
    const attribs = attribsResponse.Attributes
    const queueArn = attribs.QueueArn
    // subscribe SQS queue to SNS topic
    const subscribed = await snsClient.send(new SubscribeCommand({TopicArn: topicArn, Protocol:'sqs', Endpoint: queueArn}))
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "MyPolicy",
          Effect: "Allow",
          Principal: {AWS: "*"},
          Action: "SQS:SendMessage",
          Resource: queueArn,
          Condition: {
            ArnEquals: {
              'aws:SourceArn': topicArn
            }
          }
        }
      ]
    };
 
    const response = await sqsClient.send(new SetQueueAttributesCommand({QueueUrl: sqsQueueUrl, Attributes: {Policy: JSON.stringify(policy)}}))
    return [sqsQueueUrl, topicArn]
 
  } catch (err) {
    console.log({ level: "error", message: `Error in create topic and queue function: ${err}`});
  }
}

const deleteTopicAndQueue = async (sqsQueueUrlArg, snsTopicArnArg) => {
  const deleteQueue = await sqsClient.send(new DeleteQueueCommand({QueueUrl: sqsQueueUrlArg}));
  const deleteTopic = await snsClient.send(new DeleteTopicCommand({TopicArn: snsTopicArnArg}));
  console.log({ level: 'info', message: 'Successfully deleted topic & queue' })
}

const GetResults = async (processType, JobID) => {
  var maxResults = 1000
  var paginationToken = null
  var finished = false
  let documentsArray = [];

  while (finished == false){
    var response = null
    if (processType == 'ANALYSIS'){
      if (paginationToken == null){
        response = textractClient.send(new GetDocumentAnalysisCommand({JobId:JobID, MaxResults:maxResults}))
      } else {
        response = textractClient.send(new GetDocumentAnalysisCommand({JobId:JobID, MaxResults:maxResults, NextToken:paginationToken}))
      }
    }
      
    if(processType == 'DETECTION'){
      if (paginationToken == null){
        response = textractClient.send(new GetDocumentTextDetectionCommand({JobId:JobID, MaxResults:maxResults}))
      } else {
        response = textractClient.send(new GetDocumentTextDetectionCommand({JobId:JobID, MaxResults:maxResults, NextToken:paginationToken}))
      }
    }

    if(processType = 'LENDER'){
      if (paginationToken == null){
        response = textractClient.send(new GetLendingAnalysisCommand({JobId:JobID, MaxResults:maxResults}))
      } else {
        response = textractClient.send(new GetLendingAnalysisCommand({JobId:JobID, MaxResults:maxResults, NextToken:paginationToken}))
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log({level: 'info', message: "Detected Documented Text" })
    var docMetadata = (await response).DocumentMetadata
    var results = (await response).Results
    //I've tried passing reponse, results,
    // THIS IS WHERE WE WILL GET THE TYPES & VALUES (Extractions)
    // results.forEach((r: LendingDocumentEntity) => {
    //   const pagetype = r.PageClassification.PageType[0].Value;
    //   let documentFields: any = [];
    //   // console.log("Page Type Confidence: ", r.PageClassification.PageType[0].Confidence);
    //   if(r.Extractions.length > 0){
    //   var fields = r.Extractions[0].LendingDocument.LendingFields;
    //   startHumanLoop(fields[0], docMetadata[0])
    //     fields.forEach((e: LendingDocumentField) => {
    //       // There are sometimes multiple value detections, sometimes there are none
    //       if(e.ValueDetections.length > 0){
    //         // Right now it is appending the first value NOT the most confident
    //         documentFields.push({Type: e.Type, Value: e.ValueDetections[0].Text});
    //         // console.log('Value Confidence: ', e.ValueDetections[0].Confidence);
    //       } else {
    //         console.log({level: 'info', message: `Type ${e.Type} Value not found`});
    //       }
    //     })
    //   }
    //   let documentObject: DocumentModelOutput = {documentType: pagetype, documentFields: documentFields}
    //   documentsArray.push(documentObject);
    // });

    if(String(response).includes("NextToken")){
      paginationToken = response.NextToken
    }else{
      finished = true
    }
  }
  return documentsArray;
}

const GetLendingSummary = async (processType, JobID) => {
  var maxResults = 1000
  var paginationToken = null
  var finished = false

  while (finished == false){
    var response = null

    if(processType = 'LENDER'){
      if (paginationToken == null){
        response = textractClient.send(new GetLendingAnalysisSummaryCommand({JobId:JobID}))
      } else {
        response = textractClient.send(new GetLendingAnalysisSummaryCommand({JobId:JobID}))
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log({level: 'info', message: "Detected Documented Text Summary" })
    // BELOW LINE RETURNS THE NUMBER OF PAGES IN THE ANALYZED DOCUMENT
    // var docMetadata = (await response).DocumentMetadata.Pages
    var summary = (await response).Summary
    console.log('Summary:', summary)

    // BELOW LINE RETURNS A SUMMARY OBJECT OF THE ANALYZED DOCUMENT
    // var summary = (await sumResponse).Summary

    // BELOW LINE RETURNS THE TYPE OF DOCUMENTS 
    // var docGroup = (await sumResponse).Summary.DocumentGroups

    if(String(response).includes("NextToken")){
      paginationToken = response.NextToken
    }else{
      finished = true
    }
  }

}

const startHumanLoop = async (humanLoopInput, metadata) => {
  console.log("this is the humanLoopInput", humanLoopInput);
  // const awaitedResponse = await humanLoopInput;
  const stringInput = JSON.stringify(humanLoopInput);
  const params = {
    HumanLoopName: `docpross-human-workflow-${Date.now()}`,
    FlowDefinitionArn: process.env.A2I_ARN,
    HumanLoopInput: {
      InputContent: JSON.stringify({
        key1: 'value1',
        key2: 'value2'
      })
    }
  };
  const command = new StartHumanLoopCommand(params);
  try {
    const response = await a2iRuntimeClient.send(command);
    console.log(`Started human loop with ID ${response.HumanLoopArn}`);
    return response.HumanLoopArn;
  } catch (error) {
    console.log(`Error starting human loop: ${error}`);
    return null;
  }
}

 // DELETE TOPIC AND QUEUE
const main = async (processType, bucket, documentName, roleArn) => {
  var sqsAndTopic = await createTopicandQueue();
  var process = await processDocument(processType, bucket, documentName, roleArn, sqsAndTopic[0], sqsAndTopic[1])
  // var humanLoop = await startHumanLoop('testhumanLoop1', process[0]);
  // console.log('humanLoop result == ', humanLoop);
  var deleteResults = await deleteTopicAndQueue(sqsAndTopic[0], sqsAndTopic[1])
  return process;
}

export {
  processDocument,
  deleteTopicAndQueue,
  GetResults,
  startHumanLoop,
  main,
}