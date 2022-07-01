/**
 * 启用redis client的数量，若设置10，则启用redis的0-9个db.(集群模式下 只用一个db0.说明单机状态下多redis-DB的性能并没有多少提升，故只用默认db就好了)
 */
// export const REDIS_CLIENT_COUNT = 1;

import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

// type ClientIndex<T> = {
//   [K in keyof T]: number;
// };

/**
 * Redis Client Name
 */
export const RedisStorePrefix = {
  // JSON对象相关存储，序列化成JSON字符串后存储，取值再转换为JSON对象返回
  JsonStore: 'JsonStore',
  // 存储一般字符串
  StringStore: 'StringStore',
  // JWT相关存储
  JwtStore: 'JwtStore',
  // 限流器相关存储
  throttlerStore: 'throttlerStore',
};

export interface RedisStore {
  set(key: string, val: unknown, ttl: number): void;
  get(key: string): unknown;
  del(key: string): void;
}

export type RedisClient = RedisClientType<
  RedisDefaultModules & RedisModules,
  RedisFunctions,
  RedisScripts
>;
