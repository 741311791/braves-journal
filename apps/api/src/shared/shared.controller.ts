import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Shared')
@ApiBearerAuth()
@Controller('shared')
export class SharedController {
  @Get()
  getPlaceholder() {
    return { message: 'Shared module - placeholder' };
  }
}
