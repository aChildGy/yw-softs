import { NestFactory } from '@nestjs/core';
import { E2eDemoModule } from './e2e-demo.module';

async function bootstrap() {
  const app = await NestFactory.create(E2eDemoModule);
  await app.listen(3000);
}
bootstrap();
