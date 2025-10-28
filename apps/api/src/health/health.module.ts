import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { DatabaseHealthIndicator } from './indicators/database.health';
import { StorageHealthIndicator } from './indicators/storage.health';

@Module({
  imports: [ConfigModule, TerminusModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator, StorageHealthIndicator],
})
export class HealthModule {}
