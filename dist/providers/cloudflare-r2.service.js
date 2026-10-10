"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareR2Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const abstract_s3_storage_service_1 = require("./abstract-s3-storage.service");
let CloudflareR2Service = class CloudflareR2Service extends abstract_s3_storage_service_1.AbstractS3StorageService {
    constructor(config, options) {
        const accountId = options?.r2?.accountId ?? config.getOrThrow('R2_ACCOUNT_ID');
        super(config, {
            bucket: options?.r2?.bucket ?? config.getOrThrow('R2_BUCKET'),
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            accessKey: options?.r2?.accessKeyId ?? config.getOrThrow('R2_ACCESS_KEY_ID'),
            secretKey: options?.r2?.secretAccessKey ?? config.getOrThrow('R2_SECRET_ACCESS_KEY'),
        });
        this.accountId = accountId;
    }
    getPublicUrl(key) {
        return `https://${this.bucket}.${this.accountId}.r2.cloudflarestorage.com/${key}`;
    }
};
exports.CloudflareR2Service = CloudflareR2Service;
exports.CloudflareR2Service = CloudflareR2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], CloudflareR2Service);
//# sourceMappingURL=cloudflare-r2.service.js.map