import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import type { DatabaseConfig } from '../../config/configuration';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const dbConfig = this.configService.get<DatabaseConfig>('db');
    const isHealthy = Boolean(dbConfig?.url);

    if (isHealthy) {
      return this.getStatus(key, true, { message: 'Database configuration detected' });
    }

    throw new HealthCheckError(
      'Database check failed',
      this.getStatus(key, false, { message: 'Database URL is missing' })
    );
  }
}
