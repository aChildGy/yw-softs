import { ThrottlerStorage } from '@nestjs/throttler';

export interface ThrottlerOptions {
  storage: ThrottlerStorage;
}
