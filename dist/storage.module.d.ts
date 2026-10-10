import { DynamicModule } from '@nestjs/common';
export interface StorageModuleOptions {
    driver?: 'aws' | 'r2' | 'local' | 'DO_SPACES';
}
export declare class StorageModule {
    static register(options: StorageModuleOptions): DynamicModule;
}
