// storage.module.ts

import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { STORAGE_PROVIDER, STORAGE_OPTIONS } from './storage.constants';
import { DigitalOceanStorageService } from './providers/digitalocean-storage.service';
import { AwsStorageService } from './providers/aws-storage.service';
import { CloudflareR2Service } from './providers/cloudflare-r2.service';
import { LocalStorageService } from './providers/local-storage.service';
import {
    StorageModuleOptions,
    StorageModuleAsyncOptions,
    StorageOptionsFactory,
} from './interfaces/storage-options.interface';

@Module({
    providers: [
        {
            provide: STORAGE_OPTIONS,
            useValue: {},
        },
        {
            provide: STORAGE_PROVIDER,
            inject: [{ token: ConfigService, optional: true }, STORAGE_OPTIONS],
            useFactory: (config: ConfigService, options: StorageModuleOptions) => {
                switch (options?.driver || config?.get?.('STORAGE_DRIVER')) {
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
    /**
     * Registers the module synchronously with static options.
     */
    static forRoot(options: StorageModuleOptions = {}): DynamicModule {
        return {
            module: StorageModule,
            global: options.isGlobal,
            providers: [
                {
                    provide: STORAGE_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [STORAGE_PROVIDER],
        };
    }

    /**
     * Registers the module asynchronously.
     */
    static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
        return {
            module: StorageModule,
            global: options.isGlobal,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                ...(options.extraProviders || []),
            ],
            exports: [STORAGE_PROVIDER],
        };
    }

    /**
     * Registers the module synchronously with static options.
     * @deprecated Use `StorageModule.forRoot` instead.
     */
    static register(options: StorageModuleOptions = {}): DynamicModule {
        return this.forRoot(options);
    }

    private static createAsyncProviders(options: StorageModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        if (options.useClass) {
            return [
                this.createAsyncOptionsProvider(options),
                {
                    provide: options.useClass,
                    useClass: options.useClass,
                },
            ];
        }
        return [];
    }

    private static createAsyncOptionsProvider(options: StorageModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: STORAGE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: STORAGE_OPTIONS,
            useFactory: async (optionsFactory: StorageOptionsFactory) =>
                await optionsFactory.createStorageOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
