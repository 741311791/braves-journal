import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('DocPackages')
@ApiBearerAuth()
@Controller('doc-packages')
export class DocPackagesController {
  @Get()
  findAll() {
    return { message: 'DocPackages module - placeholder' };
  }
}
