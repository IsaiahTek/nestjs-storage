// providers/abstract-s3-storage.service.ts

import { ConfigService } from '@nestjs/config';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import {
    SignedUrlStorageProvider,
    UploadOptions,
    UploadResult,
} from '../interfaces/storage-provider.interface';

export abstract class AbstractS3StorageService
    implements SignedUrlStorageProvider {
    protected readonly client: S3Client;
    protected readonly bucket: string;
    protected readonly endpoint?: string;

    protected constructor(
        protected readonly config: ConfigService,
        options: {
            bucket: string;
            region: string;
            accessKey: string;
            secretKey: string;
            endpoint?: string;
            forcePathStyle?: boolean;
        },
    ) {
        this.bucket = options.bucket;
        this.endpoint = options.endpoint;

        this.client = new S3Client({
            region: options.region,
            endpoint: options.endpoint,
            forcePathStyle: options.forcePathStyle ?? false,

            credentials: {
                accessKeyId: options.accessKey,
                secretAccessKey: options.secretKey,
            },
        });
    }

    async upload(options: UploadOptions): Promise<UploadResult> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: options.key,
                Body: options.body,
                ACL: options.isPublic ? 'public-read' : undefined,
                ContentType: options.contentType,
                Metadata: options.metadata,
            }),
        );

        return {
            key: options.key,
            url: this.getPublicUrl(options.key),
        };
    }

    async delete(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );
    }

    async exists(key: string): Promise<boolean> {
        try {
            await this.client.send(
                new HeadObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                }),
            );

            return true;
        } catch {
            return false;
        }
    }

    async getSignedDownloadUrl(
        key: string,
        expiresIn = 3600,
    ): Promise<string> {
        return getSignedUrl(
            this.client,
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
            { expiresIn },
        );
    }

    async getSignedUploadUrl(
        key: string,
        expiresIn = 300,
        contentType?: string,
    ): Promise<string> {
        return getSignedUrl(
            this.client,
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                ContentType: contentType,
            }),
            { expiresIn },
        );
    }

    /**
     * Each provider generates public URLs differently.
     */
    protected abstract getPublicUrl(key: string): string;
}