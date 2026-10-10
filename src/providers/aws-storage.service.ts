// providers/aws-storage.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractS3StorageService } from './abstract-s3-storage.service';
import { StorageModuleOptions } from '../interfaces/storage-options.interface';

@Injectable()
export class AwsStorageService extends AbstractS3StorageService {
    private readonly region: string;

    constructor(config: ConfigService, options?: StorageModuleOptions) {
        const region = options?.aws?.region ?? config.getOrThrow<string>('AWS_REGION');

        super(config, {
            bucket: options?.aws?.bucket ?? config.getOrThrow('AWS_BUCKET'),
            region,
            accessKey: options?.aws?.accessKeyId ?? config.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretKey: options?.aws?.secretAccessKey ?? config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        });

        this.region = region;
    }

    protected getPublicUrl(key: string): string {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
}