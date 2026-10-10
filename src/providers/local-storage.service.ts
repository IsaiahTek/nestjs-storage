// providers/local-storage.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { promises as fs } from 'fs';
import * as path from 'path';

import {
  StorageProvider,
  UploadOptions,
  UploadResult,
} from '../interfaces/storage-provider.interface';
import { StorageModuleOptions } from '../interfaces/storage-options.interface';

@Injectable()
export class LocalStorageService implements StorageProvider {
  private readonly uploadDir: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService, options?: StorageModuleOptions) {
    this.uploadDir = options?.local?.path ?? this.config.get<string>(
      'LOCAL_STORAGE_PATH',
      path.join(process.cwd(), 'uploads'),
    );

    this.publicUrl = `/${path.basename(this.uploadDir)}`;
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    const filePath = path.join(this.uploadDir, options.key);

    await fs.mkdir(path.dirname(filePath), {
      recursive: true,
    });

    if (Buffer.isBuffer(options.body)) {
      await fs.writeFile(filePath, options.body);
    } else if (typeof options.body === 'string') {
      await fs.writeFile(filePath, options.body);
    } else if (options.body instanceof Uint8Array) {
      await fs.writeFile(filePath, Buffer.from(options.body));
    } else {
      throw new Error(
        'ReadableStream is not supported by LocalStorageService.',
      );
    }

    return {
      key: options.key,
      url: `${this.publicUrl}/${options.key.replace(/\\/g, '/')}`,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);

    try {
      await fs.unlink(filePath);
    } catch (e: any) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.uploadDir, key));
      return true;
    } catch {
      return false;
    }
  }

  async getSignedDownloadUrl(
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    // Local files don't require signing.
    // In production you could generate JWT-based temporary URLs instead.
    return `${this.publicUrl}/${key.replace(/\\/g, '/')}`;
  }

  async getSignedUploadUrl(): Promise<string> {
    throw new Error(
      'Signed upload URLs are not supported by LocalStorageService.',
    );
  }
}