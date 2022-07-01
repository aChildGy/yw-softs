import { DynamicModule, Module } from '@nestjs/common';
import { AppInitOptions } from './interfaces/app-init-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_COMMON_CONFIG } from 'apps/tuiyou/src/common/config/constants';
// import { validate } from './env.validation';

// 动态模块模式 register方法 可以传递参数，动态返回DynamicModule
@Module({})
export class AppInitModule {
  /**
   * 应用初始化程序，全局加载config，gql等应用基础模块。
   * @param appInitOptions
   * @returns
   */
  static register(appInitOptions: AppInitOptions): DynamicModule {
    const configOptions = appInitOptions.configOptions;
    const imports = [
      ConfigModule.forRoot({
        envFilePath: path.join(
          configOptions.envFilePath,
          `.${process.env.NODE_ENV || 'development'}.env`,
        ),
        cache: true,
        isGlobal: true,
        // 加载配置文件
        load: configOptions.configLoads || [],
        // 若项目复杂，可以把load的配置文件 分散到不同文件中，configuration.ts 示例
        // load: [
        //   // configuration1,
        //   // configuration2,
        // ],

        // 自定义数据校验
        // validate,

        // // 校验配置文件模型数据
        validationSchema: configOptions.validationSchema || [],

        validationOptions: {
          // 是否在环境变量中允许未知键。
          allowUnknown: true,
          // 如果为真，则在第一个错误时停止验证；如果为 false，则返回所有错误。
          abortEarly: true,
        },
      }),
    ];

    if (appInitOptions.graphQLOptions) {
      const graphQLOptions = appInitOptions.graphQLOptions;
      imports.push(
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          debug: graphQLOptions.debug || false,
          playground: graphQLOptions.playground || false,
          // installSubscriptionHandlers: true, // 此选项在后续更新版本中废弃。订阅功能推荐用graphql-ws来实现
          subscriptions: {
            // 数据订阅
            'graphql-ws': true,
          },
          // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          autoSchemaFile: path.join(
            graphQLOptions.schemaFilePath,
            `/schema.gql`,
          ),
          buildSchemaOptions: {
            numberScalarMode: 'integer',
            dateScalarMode: 'timestamp',
          },
        }),
      );
    }

    // 应用限流器
    if (appInitOptions.throttler) {
      imports.push(
        ThrottlerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            ttl: <number>config.get(APP_COMMON_CONFIG).throttle_ttl || 60,
            limit: <number>config.get(APP_COMMON_CONFIG).throttle_limit || 10,
          }),
        }),
      );
    }

    return {
      module: AppInitModule,
      imports: imports,
    };
  }
}
