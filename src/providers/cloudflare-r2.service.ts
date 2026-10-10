// providers/cloudflare-r2.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractS3StorageService } from './abstract-s3-storage.service';
import { StorageModuleOptions } from '../interfaces/storage-options.interface';

@Injectable()
export class CloudflareR2Service extends AbstractS3StorageService {
  private readonly accountId: string;

  constructor(config: ConfigService, options?: StorageModuleOptions) {
    const accountId = options?.r2?.accountId ?? config.getOrThrow<string>('R2_ACCOUNT_ID');

    super(config, {
      bucket: options?.r2?.bucket ?? config.getOrThrow('R2_BUCKET'),
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      accessKey: options?.r2?.accessKeyId ?? config.getOrThrow('R2_ACCESS_KEY_ID'),
      secretKey: options?.r2?.secretAccessKey ?? config.getOrThrow('R2_SECRET_ACCESS_KEY'),
    });

    this.accountId = accountId;
  }

  protected getPublicUrl(key: string): string {
    return `https://${this.bucket}.${this.accountId}.r2.cloudflarestorage.com/${key}`;
  }
}