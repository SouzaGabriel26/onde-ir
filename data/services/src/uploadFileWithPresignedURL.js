// Actual lambda function implementation

import crypto from "node:crypto";

import { response } from "./utils/response.js";

export async function handler(event) {
  const { fileName } = JSON.parse(event.body);

  if (!fileName) {
    return response(400, { message: '"fileName" é obrigatório.' });
  }


  // if (!process.env.CDN_TO_S3) {
  //   return response(400, { message: 'Invalid "CDN" environment variable.'  })
  // }

  const CDN_TO_S3 = 'https://fake-cdn-to-s3.com'

  const fileNameToSave = `${crypto.randomUUID()}-${fileName}`;
  const fileURL = `${CDN_TO_S3}/uploads/${fileNameToSave}`;

  const s3Client = new S3Client();
  const command = new PutObjectCommand({
    Bucket: "gbsouza",
    Key: `uploads/${fileNameToSave}`,
  });

  const presigned_url = await getSignedUrl(s3Client, command, { expiresIn: 30 });

  return response(200, { presigned_url, file_url: fileURL });
}

async function getSignedUrl(_client, command, _options) {
  const bucket = command.Bucket
  const key = command.Key

  const presigned_url = `https://fake-presigned-url.com?bucket=${bucket}&key=${key}`;

  return presigned_url;
}

class S3Client {}

class PutObjectCommand {
  constructor({ Bucket, Key }) {
    this.Bucket = Bucket;
    this.Key = Key;
  }
}
