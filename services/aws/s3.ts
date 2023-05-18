import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Set the AWS region
const REGION = "us-west-2"; // replace with your bucket region
const BUCKET_NAME = process.env.AWS_S3_INPUT_BUCKET; // replace with the bucket name

// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: 'us-east-1' });

//This gives a file a url so that the azure form-recognizer can call the files form the url.
const getS3SignedUrl = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({Bucket: BUCKET_NAME, Key: key});
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    return signedUrl;
};

export default getS3SignedUrl;