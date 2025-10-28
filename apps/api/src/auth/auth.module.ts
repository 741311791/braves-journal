import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseStrategy } from './supabase.strategy';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseStrategy, AuthGuard, RolesGuard],
  exports: [SupabaseStrategy, AuthGuard, RolesGuard],
})
export class AuthModule {}
