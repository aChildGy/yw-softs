import { Controller, Get } from '@nestjs/common';
import { E2eDemoService } from './e2e-demo.service';

@Controller()
export class E2eDemoController {
  constructor(private readonly e2eDemoService: E2eDemoService) {}

  @Get()
  getHello(): string {
    return this.e2eDemoService.getHello();
  }
}
