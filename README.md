# @vynelix/nestjs-storage

A robust file management module for NestJS supporting AWS S3, DigitalOcean Spaces, Cloudflare R2, and Local Storage.

## Installation

```bash
npm install @vynelix/nestjs-storage @nestjs/config
```

## Configuration

Import the `StorageModule` into your root `AppModule`. It can be configured synchronously with `forRoot()` or asynchronously with `forRootAsync()`.

> **Note:** `StorageModule.register()` is deprecated in favor of `StorageModule.forRoot()`.

### Synchronous Configuration (`forRoot`)

Configure the storage driver programmatically at module import time:

```typescript
import { Module } from '@nestjs/common';
import { StorageModule } from '@vynelix/nestjs-storage';

@Module({
  imports: [
    StorageModule.forRoot({
      isGlobal: true, // Optional: makes the module globally available
      driver: 'aws',
      aws: {
        region: 'us-east-1',
        bucket: 'my-bucket',
        accessKeyId: 'your-access-key',
        secretAccessKey: 'your-secret-key',
      },
    }),
  ],
})
export class AppModule {}
```

### Asynchronous Configuration (`forRootAsync`)

Use `forRootAsync` to load options dynamically, such as injecting `ConfigService`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageModule } from '@vynelix/nestjs-storage';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StorageModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        driver: configService.get('STORAGE_DRIVER'),
        aws: {
          region: configService.get('AWS_REGION'),
          bucket: configService.get('AWS_BUCKET'),
          accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

You can also use `useClass` or `useExisting` with a service implementing `StorageOptionsFactory`:

```typescript
import { Injectable } from '@nestjs/common';
import { StorageOptionsFactory, StorageModuleOptions } from '@vynelix/nestjs-storage';

@Injectable()
export class StorageConfigService implements StorageOptionsFactory {
  createStorageOptions(): StorageModuleOptions {
    return {
      driver: 'local',
      local: {
        path: '/custom/uploads/path',
      },
    };
  }
}

// In your module:
StorageModule.forRootAsync({
  useClass: StorageConfigService,
})
```

### Environment Variables

Set the appropriate environment variables in your `.env` file based on the storage driver you want to use.

**General**
- `STORAGE_DRIVER`: The storage driver to use. Can be `aws`, `r2`, `local`, or `DO_SPACES` (default).

**AWS S3**
- `AWS_REGION`: The region of your AWS S3 bucket.
- `AWS_BUCKET`: The name of your AWS S3 bucket.
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.

**DigitalOcean Spaces**
- `DO_SPACES_REGION`: The region of your Spaces bucket.
- `DO_SPACES_ENDPOINT`: The endpoint URL of your Spaces bucket (e.g. `nyc3.digitaloceanspaces.com`).
- `DO_SPACES_BUCKET`: The name of your Spaces bucket.
- `DO_SPACES_KEY`: Your Spaces access key ID.
- `DO_SPACES_SECRET`: Your Spaces secret access key.

**Cloudflare R2**
- `R2_ACCOUNT_ID`: Your Cloudflare account ID.
- `R2_BUCKET`: The name of your R2 bucket.
- `R2_ACCESS_KEY_ID`: Your R2 access key ID.
- `R2_SECRET_ACCESS_KEY`: Your R2 secret access key.

**Local Storage**
- `LOCAL_STORAGE_PATH`: The local directory path where files should be stored (defaults to `uploads` folder in your working directory).

## Usage

Inject the `STORAGE_PROVIDER` into your services to interact with the configured storage driver.

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { STORAGE_PROVIDER, SignedUrlStorageProvider } from '@vynelix/nestjs-storage';

@Injectable()
export class AppService {
  constructor(
    @Inject(STORAGE_PROVIDER) private readonly storageProvider: SignedUrlStorageProvider,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const result = await this.storageProvider.upload({
      key: `uploads/${file.originalname}`,
      body: file.buffer,
      contentType: file.mimetype,
      isPublic: true,
    });

    return result.url;
  }

  async getFileUrl(key: string) {
    // Generate a signed download URL valid for 1 hour (3600 seconds)
    return await this.storageProvider.getSignedDownloadUrl(key, 3600);
  }

  async deleteFile(key: string) {
    await this.storageProvider.delete(key);
  }

  async checkFileExists(key: string) {
    return await this.storageProvider.exists(key);
  }
}
```

## API

### `StorageProvider`

The base interface implemented by all storage drivers.

- `upload(options: UploadOptions): Promise<UploadResult>`
- `delete(key: string): Promise<void>`
- `exists(key: string): Promise<boolean>`

### `SignedUrlStorageProvider`

Extends `StorageProvider` with methods to generate signed URLs (available for AWS S3, DO Spaces, and Cloudflare R2). Note that local storage returns the public URL for `getSignedDownloadUrl` and throws an error for `getSignedUploadUrl`.

- `getSignedDownloadUrl(key: string, expiresIn?: number): Promise<string>`
- `getSignedUploadUrl(key: string, expiresIn?: number, contentType?: string): Promise<string>`
