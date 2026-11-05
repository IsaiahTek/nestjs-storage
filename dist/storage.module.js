"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StorageModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_constants_1 = require("./storage.constants");
const digitalocean_storage_service_1 = require("./providers/digitalocean-storage.service");
const aws_storage_service_1 = require("./providers/aws-storage.service");
const cloudflare_r2_service_1 = require("./providers/cloudflare-r2.service");
const local_storage_service_1 = require("./providers/local-storage.service");
let StorageModule = StorageModule_1 = class StorageModule {
    static forRoot(options = {}) {
        return {
            module: StorageModule_1,
            global: options.isGlobal,
            providers: [
                {
                    provide: storage_constants_1.STORAGE_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [storage_constants_1.STORAGE_PROVIDER],
        };
    }
    static forRootAsync(options) {
        return {
            module: StorageModule_1,
            global: options.isGlobal,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                ...(options.extraProviders || []),
            ],
            exports: [storage_constants_1.STORAGE_PROVIDER],
        };
    }
    static register(options = {}) {
        return this.forRoot(options);
    }
    static createAsyncProviders(options) {
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
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: storage_constants_1.STORAGE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: storage_constants_1.STORAGE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createStorageOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = StorageModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: storage_constants_1.STORAGE_OPTIONS,
                useValue: {},
            },
            {
                provide: storage_constants_1.STORAGE_PROVIDER,
                inject: [{ token: config_1.ConfigService, optional: true }, storage_constants_1.STORAGE_OPTIONS],
                useFactory: (config, options) => {
                    switch (options?.driver || config?.get?.('STORAGE_DRIVER')) {
                        case 'aws':
                            return new aws_storage_service_1.AwsStorageService(config, options);
                        case 'r2':
                            return new cloudflare_r2_service_1.CloudflareR2Service(config, options);
                        case 'local':
                            return new local_storage_service_1.LocalStorageService(config, options);
                        case 'DO_SPACES':
                        default:
                            return new digitalocean_storage_service_1.DigitalOceanStorageService(config, options);
                    }
                },
            },
        ],
        exports: [storage_constants_1.STORAGE_PROVIDER],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map