// providers/cloudflare-r2.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractS3StorageService } from './abstract-s3-storage.service';

@Injectable()
export class CloudflareR2Service extends AbstractS3StorageService {
  private readonly accountId: string;

  constructor(config: ConfigService) {
    const accountId = config.getOrThrow<string>('R2_ACCOUNT_ID');

    super(config, {
      bucket: config.getOrThrow('R2_BUCKET'),
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      accessKey: config.getOrThrow('R2_ACCESS_KEY_ID'),
      secretKey: config.getOrThrow('R2_SECRET_ACCESS_KEY'),
    });

    this.accountId = accountId;
  }

  protected getPublicUrl(key: string): string {
    return `https://${this.bucket}.${this.accountId}.r2.cloudflarestorage.com/${key}`;
  }
}