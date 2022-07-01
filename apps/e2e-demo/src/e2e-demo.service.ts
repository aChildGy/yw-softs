import { Injectable } from '@nestjs/common';

@Injectable()
export class E2eDemoService {
  getHello(): string {
    return 'Hello World!';
  }
}
