import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { validateConfig } from './config/validation';
import { PinoLoggerModule } from './common/logger/pino-logger.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrdModule } from './modules/prd/prd.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PromptsModule } from './modules/prompts/prompts.module';
import { DocPackagesModule } from './modules/doc-packages/doc-packages.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SharedModule } from './modules/shared/shared.module';
import { HealthModule } from './health/health.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateConfig,
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
