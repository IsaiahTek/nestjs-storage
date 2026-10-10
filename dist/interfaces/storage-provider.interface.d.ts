export interface UploadOptions {
    key: string;
    body: Buffer | Uint8Array | ReadableStream | string;
    contentType?: string;
    isPublic?: boolean;
    metadata?: Record<string, string>;
}
export interface UploadResult {
    key: string;
    url: string;
}
export interface StorageProvider {
    upload(options: UploadOptions): Promise<UploadResult>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}
export interface SignedUrlStorageProvider extends StorageProvider {
    getSignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    getSignedUploadUrl(key: string, expiresIn?: number, contentType?: string): Promise<string>;
}
