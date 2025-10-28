import { Controller, Get } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Public } from '../../auth/public.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Public()
  findAll(): string {
    return this.projectsService.findAll();
  }
}
