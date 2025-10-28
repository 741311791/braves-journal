import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus';
import { Pool } from 'pg';

import type { Configuration } from '../../config/configuration';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService<Configuration, true>) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const connectionString = this.configService.get('database.url', { infer: true });

    if (!connectionString) {
      return this.getStatus(key, false, {
        message: 'DATABASE_URL is not configured',
      });
    }

    const pool = new Pool({
      connectionString,
      max: 1,
      connectionTimeoutMillis: 500,
      idleTimeoutMillis: 500,
    });

    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, {
        message: error instanceof Error ? error.message : 'Database connection failed',
      });
    } finally {
      await pool.end().catch(() => undefined);
    }
  }
}
