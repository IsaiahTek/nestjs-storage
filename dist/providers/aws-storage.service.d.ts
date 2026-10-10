import { ConfigService } from '@nestjs/config';
import { AbstractS3StorageService } from './abstract-s3-storage.service';
export declare class AwsStorageService extends AbstractS3StorageService {
    private readonly region;
    constructor(config: ConfigService);
    protected getPublicUrl(key: string): string;
}
