import { Controller, Get } from '@nestjs/common';
import { HealthCheck, type HealthCheckService, type HealthCheckResult } from '@nestjs/terminus';

import { Public } from '../common/metadata/public.metadata';
import type { DatabaseHealthIndicator } from './indicators/database.health';
import type { StorageHealthIndicator } from './indicators/storage.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DatabaseHealthIndicator,
    private readonly storage: StorageHealthIndicator
  ) {}

  @Get('live')
  @Public()
  @HealthCheck()
  async checkLive(): Promise<HealthCheckResult> {
    return this.health.check([() => ({ liveness: { status: 'up' } })]);
  }

  @Get('ready')
  @Public()
  @HealthCheck()
  async checkReady(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.storage.isHealthy('storage'),
    ]);
  }
}
