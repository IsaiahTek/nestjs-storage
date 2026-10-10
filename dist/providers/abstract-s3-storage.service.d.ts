import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { SignedUrlStorageProvider, UploadOptions, UploadResult } from '../interfaces/storage-provider.interface';
export declare abstract class AbstractS3StorageService implements SignedUrlStorageProvider {
    protected readonly config: ConfigService;
    protected readonly client: S3Client;
    protected readonly bucket: string;
    protected readonly endpoint?: string;
    protected constructor(config: ConfigService, options: {
        bucket: string;
        region: string;
        accessKey: string;
        secretKey: string;
        endpoint?: string;
        forcePathStyle?: boolean;
    });
    upload(options: UploadOptions): Promise<UploadResult>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    getSignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    getSignedUploadUrl(key: string, expiresIn?: number, contentType?: string): Promise<string>;
    protected abstract getPublicUrl(key: string): string;
}
