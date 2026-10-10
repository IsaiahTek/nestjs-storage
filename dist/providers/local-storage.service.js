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
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path = require("path");
let LocalStorageService = class LocalStorageService {
    constructor(config) {
        this.config = config;
        this.uploadDir = this.config.get('LOCAL_STORAGE_PATH', path.join(process.cwd(), 'uploads'));
        this.publicUrl = this.config.get('LOCAL_STORAGE_URL', 'http://localhost:3000/uploads');
    }
    async upload(options) {
        const filePath = path.join(this.uploadDir, options.key);
        await fs_1.promises.mkdir(path.dirname(filePath), {
            recursive: true,
        });
        if (Buffer.isBuffer(options.body)) {
            await fs_1.promises.writeFile(filePath, options.body);
        }
        else if (typeof options.body === 'string') {
            await fs_1.promises.writeFile(filePath, options.body);
        }
        else if (options.body instanceof Uint8Array) {
            await fs_1.promises.writeFile(filePath, Buffer.from(options.body));
        }
        else {
            throw new Error('ReadableStream is not supported by LocalStorageService.');
        }
        return {
            key: options.key,
            url: `${this.publicUrl}/${options.key.replace(/\\/g, '/')}`,
        };
    }
    async delete(key) {
        const filePath = path.join(this.uploadDir, key);
        try {
            await fs_1.promises.unlink(filePath);
        }
        catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }
    }
    async exists(key) {
        try {
            await fs_1.promises.access(path.join(this.uploadDir, key));
            return true;
        }
        catch {
            return false;
        }
    }
    async getSignedDownloadUrl(key, expiresIn = 3600) {
        return `${this.publicUrl}/${key.replace(/\\/g, '/')}`;
    }
    async getSignedUploadUrl() {
        throw new Error('Signed upload URLs are not supported by LocalStorageService.');
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocalStorageService);
//# sourceMappingURL=local-storage.service.js.map