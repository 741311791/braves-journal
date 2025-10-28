import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import type { StorageConfig } from '../../config/configuration';

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const storageConfig = this.configService.get<StorageConfig>('storage');
    const isHealthy = Boolean(storageConfig?.endpoint);

    if (isHealthy) {
      return this.getStatus(key, true, { message: 'Storage configuration detected' });
    }

    throw new HealthCheckError(
      'Storage check failed',
      this.getStatus(key, false, { message: 'Storage endpoint is missing' })
    );
  }
}
