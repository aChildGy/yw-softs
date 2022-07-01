import { AppInitModule } from '@app/app-init';
import { Module } from '@nestjs/common';
import { E2eDemoController } from './e2e-demo.controller';
import { E2eDemoService } from './e2e-demo.service';
import { FooModule } from './foo/foo.module';
import { TooModule } from './too/too.module';

import commonConfig from './common/config/common-config';
import validationSchema from './common/config/env.validation-schema';

import mainDBConfig from './common/config/main-db-config';
import logDBConfig from './common/config/log-db-config';
import { DatabasesModule } from '@app/databases';
import { Foo } from './foo/entities/foo.entity';

@Module({
  imports: [
    FooModule,
    TooModule,
    AppInitModule.register({
      configOptions: {
        envFilePath: __dirname,
        // 按业务注册环境变量配置
        configLoads: [
          commonConfig.register,
          mainDBConfig.register,
          logDBConfig.register,
        ],
        validationSchema: validationSchema,
      },
      graphQLOptions: {
        schemaFilePath: __dirname,
        debug: false,
        playground: true,
      },
    }),
    DatabasesModule.register([
      {
        connectionName: mainDBConfig.key,
        connOptionsOrConnConfigKey: mainDBConfig.key,
        defaultConnection: true,
        entities: [Foo],
      },
      // {
      //   connectionName: logDBConfig.key,
      //   connOptionsOrConnConfigKey: logDBConfig.key,
      //   entities: [Too],
      // },
    ]),
  ],
  controllers: [E2eDemoController],
  providers: [E2eDemoService],
})
export class E2eDemoModule {}
