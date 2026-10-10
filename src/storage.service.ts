// storage.service.ts

import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.DO_SPACES_REGION,

      endpoint: process.env.DO_SPACES_ENDPOINT,

      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
      },

      forcePathStyle: false,
    });
  }

  async upload(
    key: string,
    buffer: Buffer,
    contentType: string,
  ) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read', // Optional
      }),
    );

    return `${process.env.DO_SPACES_BUCKET}.${new URL(process.env.DO_SPACES_ENDPOINT!).host}/${key}`;
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: key,
      }),
    );
  }

  async get(key: string) {
    return this.client.send(
      new GetObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: key,
      }),
    );
  }
}