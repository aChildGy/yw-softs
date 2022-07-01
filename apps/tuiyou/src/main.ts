import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppRootModule } from './app.module';
import { APP_COMMON_CONFIG } from './common/config/constants';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppRootModule);
  const configService = app.get(ConfigService);

  // 启用helmet 正式环境启用，测试和开发环境不启用
  if (
    !(
      configService.get(APP_COMMON_CONFIG).NODE_ENV === 'development' ||
      configService.get(APP_COMMON_CONFIG).NODE_ENV === 'test'
    )
  ) {
    app.use(helmet());
  }

  const port = <number>configService.get(APP_COMMON_CONFIG).port;
  await app.listen(port);
}
bootstrap();
