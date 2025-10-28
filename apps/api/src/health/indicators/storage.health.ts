import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

import type { Configuration } from '../../config/configuration';

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService<Configuration, true>) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const storageConfig = this.configService.get('storage', { infer: true });

    if (!storageConfig.endpoint || !storageConfig.bucket) {
      return this.getStatus(key, false, {
        message: 'Storage configuration is incomplete',
      });
    }

    const client = new S3Client({
      endpoint: storageConfig.endpoint,
      region: storageConfig.region,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
      forcePathStyle: true,
    });

    try {
      await client.send(new HeadBucketCommand({ Bucket: storageConfig.bucket }));
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, {
        message: error instanceof Error ? error.message : 'Storage connection failed',
      });
    }
  }
}
