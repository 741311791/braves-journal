import { Controller, Get } from '@nestjs/common';
import { PrdService } from './prd.service';

@Controller('prd')
export class PrdController {
  constructor(private readonly prdService: PrdService) {}

  @Get()
  findAll(): string {
    return this.prdService.findAll();
  }
}
