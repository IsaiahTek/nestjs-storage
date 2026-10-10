import { ConfigService } from '@nestjs/config';
import { StorageProvider, UploadOptions, UploadResult } from '../interfaces/storage-provider.interface';
export declare class LocalStorageService implements StorageProvider {
    private readonly config;
    private readonly uploadDir;
    private readonly publicUrl;
    constructor(config: ConfigService);
    upload(options: UploadOptions): Promise<UploadResult>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    getSignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    getSignedUploadUrl(): Promise<string>;
}
