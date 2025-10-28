import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SupabaseStrategy } from './supabase.strategy';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseStrategy],
  exports: [SupabaseStrategy],
})
export class AuthModule {}
