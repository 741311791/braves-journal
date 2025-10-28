import { Module } from '@nestjs/common';
import { DocPackagesController } from './doc-packages.controller';
import { DocPackagesService } from './doc-packages.service';

@Module({
  controllers: [DocPackagesController],
  providers: [DocPackagesService],
})
export class DocPackagesModule {}
