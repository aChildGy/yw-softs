import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  REDIS_CLIENT,
  RedisStore,
  RedisStorePrefix,
  RedisClient,
} from '../constants';
import { CheckRedisModule } from './redis.module-check';

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationBootstrap {
  private redisClient: RedisClient;

  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const logger = new Logger(RedisService.name);

    const client = this.moduleRef.get(REDIS_CLIENT);

    client.on('error', (err) => logger.error(REDIS_CLIENT, err));

    await client.connect();

    this.redisClient = client;
  }

  async onApplicationBootstrap() {
    // 验证redis模块是否都开启，满足应用运行条件
    const client = this.redisClient;

    await CheckRedisModule(client);
  }

  async getJsonStore(): Promise<RedisStore> {
    const client = this.redisClient;
    console.log(client, RedisStorePrefix.JsonStore);
    return {
      set(key, val, ttl) {
        //TODO
      },
      get(key) {
        //TODO
      },
      del(key) {
        //TODO
      },
    };
  }
}
