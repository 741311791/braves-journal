import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  findAll(): string {
    return 'Tasks module placeholder';
  }
}
