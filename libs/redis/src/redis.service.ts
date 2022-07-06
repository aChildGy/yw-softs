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

    this.redisClient = client;

    client.on('error', (err) => logger.error(REDIS_CLIENT, err));

    await client.connect();
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
        const StoreKey = `${RedisStorePrefix.JsonStore}-${key}`;
        const result = await client.json.set(StoreKey, path, json, opt || null);
        return result;
      },
      async get(key: string, path: string): Promise<RedisJSON> {
        const StoreKey = `${RedisStorePrefix.JsonStore}-${key}`;
        const result = await client.json.get(StoreKey, { path });
        return result;
      },
      async del(key, path: string): Promise<number> {
        const StoreKey = `${RedisStorePrefix.JsonStore}-${key}`;
        const result = await client.json.del(StoreKey, path);
        return <number>result;
      },
    };
  }

  async getStringStore(): Promise<RedisStringStore> {
    const client = this.redisClient;

    return {
      async set(key, val, ttl): Promise<'OK' | null> {
        const StoreKey = `${RedisStorePrefix.StringStore}-${key}`;
        const result = await client.set(StoreKey, val, { EX: ttl || 0 });
        return <'OK' | null>result;
      },
      async get(key: string): Promise<string | number | null> {
        const StoreKey = `${RedisStorePrefix.StringStore}-${key}`;
        const result = await client.get(StoreKey);
        return <string | number | null>result;
      },
      async del(key): Promise<number> {
        const StoreKey = `${RedisStorePrefix.StringStore}-${key}`;
        const result = await client.del(StoreKey);
        return <number>result;
      },
    };
  }

  async getJwtStore(): Promise<RedisStringStore> {
    const client = this.redisClient;

    return {
      async set(key, val, ttl): Promise<'OK' | null> {
        const StoreKey = `${RedisStorePrefix.JwtStore}-${key}`;
        const result = await client.set(StoreKey, val, { EX: ttl || 0 });
        return <'OK' | null>result;
      },
      async get(key: string): Promise<string | number | null> {
        const StoreKey = `${RedisStorePrefix.JwtStore}-${key}`;
        const result = await client.get(StoreKey);
        return <string | number | null>result;
      },
      async del(key): Promise<number> {
        const StoreKey = `${RedisStorePrefix.JwtStore}-${key}`;
        const result = await client.del(StoreKey);
        return <number>result;
      },
    };
  }

  async getThrottlerStore(): Promise<RedisStringStore> {
    const client = this.redisClient;

    return {
      async set(key, val, ttl): Promise<'OK' | null> {
        const StoreKey = `${RedisStorePrefix.throttlerStore}-${key}`;
        const result = await client.set(StoreKey, val, { EX: ttl || 0 });
        return <'OK' | null>result;
      },
      async get(key: string): Promise<string | number | null> {
        const StoreKey = `${RedisStorePrefix.throttlerStore}-${key}`;
        const result = await client.get(StoreKey);
        return <string | number | null>result;
      },
      async del(key): Promise<number> {
        const StoreKey = `${RedisStorePrefix.throttlerStore}-${key}`;
        const result = await client.del(StoreKey);
        return <number>result;
      },
    };
  }
}
