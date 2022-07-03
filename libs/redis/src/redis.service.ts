import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  RedisClient,
  RedisJSON,
  RedisJSONStore,
  RedisStringStore,
} from './interfaces/redis.interface';
import { REDIS_CLIENT, RedisStorePrefix } from './constants';

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

  async getJsonStore(): Promise<RedisJSONStore> {
    const client = this.redisClient;

    return {
      async set(key, path, json, opt): Promise<'OK' | null> {
        const JsonKey = `${RedisStorePrefix.JsonStore}-${key}`;
        const result = await client.json.set(JsonKey, path, json, opt);

        return result;
      },
      async get(key: string, path: string): Promise<RedisJSON> {
        //TODO
        return null;
      },
      del(key) {
        //TODO
      },
    };
  }
}
