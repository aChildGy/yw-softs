import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisConfigOptions } from './redis.config.options.interface';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { REDIS_CLIENT } from './constants';

// 动态模块模式 register方法 可以传递参数，动态返回DynamicModule
@Module({})
export class RedisModule {
  static async forRootAsync(conf: RedisConfigOptions): Promise<DynamicModule> {
    const providers: Provider[] = [];
    providers.push({
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const options = configService.get(conf.configKey);
        // {
        //   host: 'r-2ze413114d90b3d4.redis.rds.aliyuncs.com',
        //   port: '6379',
        //   username: undefined,
        //   password: 'gyZ123456'
        // }
        // redis[s]://[[username][:password]@][host][:port][/db-number]:
        const client = createClient({
          url: `redis://${options.username || ''}:${options.password || ''}@${
            options.host
          }:${options.port}`,
        });
        return client;
      },
      inject: [ConfigService],
    });

    return {
      global: true,
      module: RedisModule,
      providers: [...providers, RedisService],
      exports: [RedisService],
    };
  }
}
