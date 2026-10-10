export interface StorageModuleOptions {
    driver?: 'aws' | 'r2' | 'local' | 'DO_SPACES';
    aws?: {
        region?: string;
        bucket?: string;
        accessKeyId?: string;
        secretAccessKey?: string;
    };
    doSpaces?: {
        region?: string;
        endpoint?: string;
        bucket?: string;
        accessKeyId?: string;
        secretAccessKey?: string;
    };
    r2?: {
        accountId?: string;
        bucket?: string;
        accessKeyId?: string;
        secretAccessKey?: string;
    };
    local?: {
        path?: string;
        url?: string;
    };
}
