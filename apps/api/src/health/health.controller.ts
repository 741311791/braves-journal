import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { Public } from '../auth/public.decorator';
import { DatabaseHealthIndicator } from './indicators/database.health';
import { StorageHealthIndicator } from './indicators/storage.health';

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
  checkLiveness(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }

  @Get('ready')
  @Public()
  @HealthCheck()
  checkReadiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.storage.isHealthy('storage'),
    ]);
  }
}
