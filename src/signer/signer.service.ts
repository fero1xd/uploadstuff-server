import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class SignerService {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_TOKEN,
        secretAccessKey: process.env.S3_SECRET_TOKEN,
      },
      region: process.env.S3_REGION,
    });
  }

  async signUrl(fileKey: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }
}
