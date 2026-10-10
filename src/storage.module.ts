// storage.module.ts

import { DynamicModule, Module } from '@nestjs/common';

import { STORAGE_PROVIDER, STORAGE_OPTIONS } from './storage.constants';
import { DigitalOceanStorageService } from './providers/digitalocean-storage.service';
import { ConfigService } from '@nestjs/config';
import { AwsStorageService } from './providers/aws-storage.service';
import { CloudflareR2Service } from './providers/cloudflare-r2.service';
import { LocalStorageService } from './providers/local-storage.service';
import { StorageModuleOptions } from './interfaces/storage-options.interface';

@Module({
    providers: [
        {
            provide: STORAGE_OPTIONS,
            useValue: {},
        },
        {
            provide: STORAGE_PROVIDER,
            inject: [ConfigService, STORAGE_OPTIONS],
            useFactory: (config: ConfigService, options: StorageModuleOptions) => {
                switch (options.driver || config.get('STORAGE_DRIVER')) {
                    case 'aws':
                        return new AwsStorageService(config, options);

                    case 'r2':
                        return new CloudflareR2Service(config, options);

                    case 'local':
                        return new LocalStorageService(config, options);

                    case 'DO_SPACES':
                    default:
                        return new DigitalOceanStorageService(config, options);
                }
            },
        },
    ],
    exports: [STORAGE_PROVIDER],
})
export class StorageModule {
    static register(options: StorageModuleOptions): DynamicModule {
        return {
            module: StorageModule,
            providers: [
                {
                    provide: STORAGE_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
}