import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  findAll(): string {
    return 'Analytics module placeholder';
  }
}
