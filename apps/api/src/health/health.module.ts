import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DatabaseHealthIndicator } from './indicators/database.health';
import { StorageHealthIndicator } from './indicators/storage.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator, StorageHealthIndicator],
  exports: [DatabaseHealthIndicator, StorageHealthIndicator],
})
export class HealthModule {}
