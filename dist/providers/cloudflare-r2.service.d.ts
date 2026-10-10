import { ConfigService } from '@nestjs/config';
import { AbstractS3StorageService } from './abstract-s3-storage.service';
export declare class CloudflareR2Service extends AbstractS3StorageService {
    private readonly accountId;
    constructor(config: ConfigService);
    protected getPublicUrl(key: string): string;
}
