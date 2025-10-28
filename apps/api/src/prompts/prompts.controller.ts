import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Prompts')
@ApiBearerAuth()
@Controller('prompts')
export class PromptsController {
  @Get()
  findAll() {
    return { message: 'Prompts module - placeholder' };
  }
}
