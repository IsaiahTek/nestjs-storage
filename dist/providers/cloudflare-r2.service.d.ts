import { ConfigService } from '@nestjs/config';
import { AbstractS3StorageService } from './abstract-s3-storage.service';
import { StorageModuleOptions } from '../interfaces/storage-options.interface';
export declare class CloudflareR2Service extends AbstractS3StorageService {
    private readonly accountId;
    constructor(config: ConfigService, options?: StorageModuleOptions);
    protected getPublicUrl(key: string): string;
}
