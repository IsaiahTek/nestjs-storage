import { ModuleMetadata, Provider, Type } from '@nestjs/common';
export interface StorageModuleOptions {
    driver?: 'aws' | 'r2' | 'local' | 'DO_SPACES';
    isGlobal?: boolean;
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
    };
}
export interface StorageOptionsFactory {
    createStorageOptions(): Promise<StorageModuleOptions> | StorageModuleOptions;
}
export type StorageModuleOptionsFactory = StorageOptionsFactory;
export interface StorageModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useExisting?: Type<StorageOptionsFactory>;
    useClass?: Type<StorageOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<StorageModuleOptions> | StorageModuleOptions;
    extraProviders?: Provider[];
    isGlobal?: boolean;
}
