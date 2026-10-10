"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractS3StorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class AbstractS3StorageService {
    constructor(config, options) {
        this.config = config;
        this.bucket = options.bucket;
        this.endpoint = options.endpoint;
        this.client = new client_s3_1.S3Client({
            region: options.region,
            endpoint: options.endpoint,
            forcePathStyle: options.forcePathStyle ?? false,
            credentials: {
                accessKeyId: options.accessKey,
                secretAccessKey: options.secretKey,
            },
        });
    }
    async upload(options) {
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: options.key,
            Body: options.body,
            ACL: options.isPublic ? 'public-read' : undefined,
            ContentType: options.contentType,
            Metadata: options.metadata,
        }));
        return {
            key: options.key,
            url: this.getPublicUrl(options.key),
        };
    }
    async delete(key) {
        await this.client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
    async exists(key) {
        try {
            await this.client.send(new client_s3_1.HeadObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
            return true;
        }
        catch {
            return false;
        }
    }
    async getSignedDownloadUrl(key, expiresIn = 3600) {
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }), { expiresIn });
    }
    async getSignedUploadUrl(key, expiresIn = 300, contentType) {
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        }), { expiresIn });
    }
}
exports.AbstractS3StorageService = AbstractS3StorageService;
//# sourceMappingURL=abstract-s3-storage.service.js.map