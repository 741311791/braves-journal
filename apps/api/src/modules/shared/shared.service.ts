import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  getInfo(): string {
    return 'Shared module placeholder';
  }
}
