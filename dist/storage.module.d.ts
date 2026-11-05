import { DynamicModule } from '@nestjs/common';
import { StorageModuleOptions, StorageModuleAsyncOptions } from './interfaces/storage-options.interface';
export declare class StorageModule {
    static forRoot(options?: StorageModuleOptions): DynamicModule;
    static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule;
    static register(options?: StorageModuleOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
