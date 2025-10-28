import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  findAll(): string {
    return 'Projects module placeholder';
  }
}
