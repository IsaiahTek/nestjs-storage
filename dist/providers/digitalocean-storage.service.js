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
exports.DigitalOceanStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const abstract_s3_storage_service_1 = require("./abstract-s3-storage.service");
let DigitalOceanStorageService = class DigitalOceanStorageService extends abstract_s3_storage_service_1.AbstractS3StorageService {
    constructor(config, options) {
        super(config, {
            bucket: options?.doSpaces?.bucket ?? config.getOrThrow('DO_SPACES_BUCKET'),
            region: options?.doSpaces?.region ?? config.getOrThrow('DO_SPACES_REGION'),
            endpoint: options?.doSpaces?.endpoint ?? config.getOrThrow('DO_SPACES_ENDPOINT'),
            accessKey: options?.doSpaces?.accessKeyId ?? config.getOrThrow('DO_SPACES_KEY'),
            secretKey: options?.doSpaces?.secretAccessKey ?? config.getOrThrow('DO_SPACES_SECRET'),
        });
    }
    getPublicUrl(key) {
        return `https://${this.bucket}.${new URL(this.endpoint).host}/${key}`;
    }
};
exports.DigitalOceanStorageService = DigitalOceanStorageService;
exports.DigitalOceanStorageService = DigitalOceanStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], DigitalOceanStorageService);
//# sourceMappingURL=digitalocean-storage.service.js.map