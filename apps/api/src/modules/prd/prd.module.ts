import { Module } from '@nestjs/common';
import { PrdController } from './prd.controller';
import { PrdService } from './prd.service';

@Module({
  controllers: [PrdController],
  providers: [PrdService],
})
export class PrdModule {}
