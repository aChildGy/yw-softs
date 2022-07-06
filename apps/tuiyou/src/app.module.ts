import { DatabasesModule } from '@app/databases';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
  RequestMethod,
} from '@nestjs/common';

import { AppInitModule } from '@app/app-init';
import { UsersModule } from './users/users.module';

import { User } from './users/entities/user.entity';

// 应用基本环境变量配置
import commonConfig from './common/config/common-config';

// 数据库配置遵循typeorm库数据源的配置
import mainDBConfig from './common/config/main-db-config';
import logDBConfig from './common/config/log-db-config';

import redisConfig from './common/config/redis-config';

import validationSchema from './common/config/env.validation-schema';
import { AppLoggerModule } from '@app/logger';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import {
  AuthModule,
  UpdateRequestCtxInterceptor,
  JwtAuthGuard,
  RolesGuard,
  CreateRequestCtxMiddleware,
} from '@app/auth';
import { cryptoConstants, jwtConstants } from './constants';
import { UsersService } from './users/users.service';
import { ExceptionLogger } from './logger/entities/exception.logger.entity';
import { UserDetail } from './users/entities/user.detail.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserRole } from './users/entities/user-role.entity';
import { ReqToResTimeInterceptor } from './common/interceptors/logging.interceptor';
import { USER_SERVICE } from '@app/auth/constants';
import { CheckRequestSizeMiddleware } from './common/middlewares/check.request.size.middleware';
import { AppThrottlerGuard } from './common/guards/app.throttler.guard';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    AppInitModule.register({
      configOptions: {
        envFilePath: __dirname,
        // 按业务注册环境变量配置
        configLoads: [
          commonConfig.register,
          mainDBConfig.register,
          logDBConfig.register,
          redisConfig.register,
        ],
        validationSchema: validationSchema,
      },
      graphQLOptions: {
        schemaFilePath: __dirname,
        debug: false,
        playground: true,
      },
      // 限流模块
      throttlerOptions: {
        storage: null,
      },
    }),

    DatabasesModule.register([
      {
        connectionName: mainDBConfig.key,
        connOptionsOrConnConfigKey: mainDBConfig.key,
        defaultConnection: true,
        entities: [User, UserDetail, UserRole, ExceptionLogger],
      },
      // 多数据源，导致e2e测试失败。等找到解决方法之后 再启用多数据源
      // e2e测试时，得到错误: Nest could not find DataSource element (this provider does not exist in the current context)
      // {
      //   connectionName: logDBConfig.key,
      //   connOptionsOrConnConfigKey: logDBConfig.key,
      //   entities: [ExceptionLogger],
      // },
    ]),
    AppLoggerModule.forFeature({
      connectionName: 'default', // logDBConfig.key,
      ExceptionLoggerEntity: ExceptionLogger,
    }),
    RedisModule.forRootAsync({
      configKey: redisConfig.key,
    }),
    UsersModule,
    AuthModule.register({
      jwtOptions: jwtConstants,
      cryptoOptions: cryptoConstants,
      imports: [UsersModule],
      providers: [
        {
          provide: USER_SERVICE,
          useClass: UsersService,
        },
      ],
    }),
    // CaslModule.register({ CaslRuleProvider: AuthRules }),
  ],
  controllers: [AppController],
  providers: [
    // 多个全局守卫，按数组顺序依次执行
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    // 多个全局拦截器，按数组顺序依次执行
    {
      provide: APP_INTERCEPTOR,
      useClass: UpdateRequestCtxInterceptor,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ReqToResTimeInterceptor,
    },

    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },

    // {
    //   provide: 'PUB_SUB',
    //   useValue: new PubSub(),
    // }
  ],
})
export class AppRootModule implements OnApplicationBootstrap, NestModule {
  constructor(private configService: ConfigService) {}
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(CheckRequestSizeMiddleware, CreateRequestCtxMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  onApplicationBootstrap() {
    const port = <number>this.configService.get(commonConfig.key).port;
    const logger = new Logger('NestApplication');
    if (!isNaN(+port)) {
      logger.log(
        `Process Env: ${this.configService.get(commonConfig.key).NODE_ENV}`,
      );
      logger.log(`Listen Port:${port}`);
    }
  }
}
