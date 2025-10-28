import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('PRD')
@ApiBearerAuth()
@Controller('prd')
export class PrdController {
  @Get()
  findAll() {
    return { message: 'PRD module - placeholder' };
  }
}
