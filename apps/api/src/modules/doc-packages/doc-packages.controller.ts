import { Controller, Get } from '@nestjs/common';
import { DocPackagesService } from './doc-packages.service';

@Controller('doc-packages')
export class DocPackagesController {
  constructor(private readonly docPackagesService: DocPackagesService) {}

  @Get()
  findAll(): string {
    return this.docPackagesService.findAll();
  }
}
