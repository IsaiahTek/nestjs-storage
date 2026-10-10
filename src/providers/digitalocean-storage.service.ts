// providers/digitalocean-storage.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractS3StorageService } from './abstract-s3-storage.service';
import { StorageModuleOptions } from '../interfaces/storage-options.interface';

@Injectable()
export class DigitalOceanStorageService extends AbstractS3StorageService {
    constructor(config: ConfigService, options?: StorageModuleOptions) {
        super(config, {
            bucket: options?.doSpaces?.bucket ?? config.getOrThrow('DO_SPACES_BUCKET'),
            region: options?.doSpaces?.region ?? config.getOrThrow('DO_SPACES_REGION'),
            endpoint: options?.doSpaces?.endpoint ?? config.getOrThrow('DO_SPACES_ENDPOINT'),
            accessKey: options?.doSpaces?.accessKeyId ?? config.getOrThrow('DO_SPACES_KEY'),
            secretKey: options?.doSpaces?.secretAccessKey ?? config.getOrThrow('DO_SPACES_SECRET'),
        });
    }

    protected getPublicUrl(key: string): string {
        return `https://${this.bucket}.${new URL(this.endpoint!).host}/${key}`;
    }
}