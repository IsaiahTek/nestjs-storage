export declare class StorageService {
    private readonly client;
    constructor();
    upload(key: string, buffer: Buffer, contentType: string): Promise<string>;
    delete(key: string): Promise<void>;
    get(key: string): Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
}
