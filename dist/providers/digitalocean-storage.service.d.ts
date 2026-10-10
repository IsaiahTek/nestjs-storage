import { ConfigService } from '@nestjs/config';
import { AbstractS3StorageService } from './abstract-s3-storage.service';
export declare class DigitalOceanStorageService extends AbstractS3StorageService {
    constructor(config: ConfigService);
    protected getPublicUrl(key: string): string;
}
