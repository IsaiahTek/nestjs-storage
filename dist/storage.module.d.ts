import { DynamicModule } from '@nestjs/common';
import { StorageModuleOptions } from './interfaces/storage-options.interface';
export declare class StorageModule {
    static register(options: StorageModuleOptions): DynamicModule;
}
