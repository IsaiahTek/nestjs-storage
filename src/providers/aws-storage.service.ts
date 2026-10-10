// providers/aws-storage.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractS3StorageService } from './abstract-s3-storage.service';

@Injectable()
export class AwsStorageService extends AbstractS3StorageService {
    private readonly region: string;

    constructor(config: ConfigService) {
        const region = config.getOrThrow<string>('AWS_REGION');

        super(config, {
            bucket: config.getOrThrow('AWS_BUCKET'),
            region,
            accessKey: config.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretKey: config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        });

        this.region = region;
    }

    protected getPublicUrl(key: string): string {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
}