import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';

import configuration from './config/configuration';
import { validateEnv } from './config/validation';
import { PinoLoggerModule } from './common/logger/pino-logger.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { PrdModule } from './prd/prd.module';
import { TasksModule } from './tasks/tasks.module';
import { PromptsModule } from './prompts/prompts.module';
import { DocPackagesModule } from './doc-packages/doc-packages.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PinoLoggerModule,
    AuthModule,
    ProjectsModule,
    PrdModule,
    TasksModule,
    PromptsModule,
    DocPackagesModule,
    AnalyticsModule,
    SharedModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
