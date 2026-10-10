import { ConfigService } from '@nestjs/config';
import { AbstractS3StorageService } from './abstract-s3-storage.service';
import { StorageModuleOptions } from '../interfaces/storage-options.interface';
export declare class DigitalOceanStorageService extends AbstractS3StorageService {
    constructor(config: ConfigService, options?: StorageModuleOptions);
    protected getPublicUrl(key: string): string;
}
