"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const storage_constants_1 = require("./storage.constants");
const digitalocean_storage_service_1 = require("./providers/digitalocean-storage.service");
const config_1 = require("@nestjs/config");
const aws_storage_service_1 = require("./providers/aws-storage.service");
const cloudflare_r2_service_1 = require("./providers/cloudflare-r2.service");
const local_storage_service_1 = require("./providers/local-storage.service");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: storage_constants_1.STORAGE_PROVIDER,
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    switch (config.get('STORAGE_DRIVER')) {
                        case 'aws':
                            return new aws_storage_service_1.AwsStorageService(config);
                        case 'r2':
                            return new cloudflare_r2_service_1.CloudflareR2Service(config);
                        case 'local':
                            return new local_storage_service_1.LocalStorageService(config);
                        case 'DO_SPACES':
                        default:
                            return new digitalocean_storage_service_1.DigitalOceanStorageService(config);
                    }
                },
            },
        ],
        exports: [storage_constants_1.STORAGE_PROVIDER],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map