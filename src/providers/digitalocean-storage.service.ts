// providers/digitalocean-storage.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractS3StorageService } from './abstract-s3-storage.service';

@Injectable()
export class DigitalOceanStorageService extends AbstractS3StorageService {
    constructor(config: ConfigService) {
        super(config, {
            bucket: config.getOrThrow('DO_SPACES_BUCKET'),
            region: config.getOrThrow('DO_SPACES_REGION'),
            endpoint: config.getOrThrow('DO_SPACES_ENDPOINT'),
            accessKey: config.getOrThrow('DO_SPACES_KEY'),
            secretKey: config.getOrThrow('DO_SPACES_SECRET'),
        });
    }

    protected getPublicUrl(key: string): string {
        return `https://${this.bucket}.${new URL(this.endpoint!).host}/${key}`;
    }
}