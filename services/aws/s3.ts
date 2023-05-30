import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = "us-east-1";
const BUCKET_NAME = process.env.AWS_S3_INPUT_BUCKET; // replace with the bucket name

// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: 'us-east-1' });

//This gives a file a url so that the azure form-recognizer can call the files form the url.
const getS3SignedUrls = async (keys: string[]): Promise<string[]> => {
    let signedUrls = [];
    // create a loop to iterate over keys and create signed urls
    for (let i = 0; i < keys.length; i++) {
        const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: keys[i] });
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
        signedUrls.push(signedUrl);
    }

    return signedUrls;
};

export default getS3SignedUrls;