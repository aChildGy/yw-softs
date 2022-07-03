import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

interface NX {
  NX: true;
}
interface XX {
  XX: true;
}

type RedisJSONArray = Array<RedisJSON>;
interface RedisJSONObject {
  [key: string]: RedisJSON;
  [key: number]: RedisJSON;
}
export type RedisJSON =
  | null
  | boolean
  | number
  | string
  | Date
  | RedisJSONArray
  | RedisJSONObject;

export interface RedisStringStore {
  set(key: string, val: string, ttl: number): void;
  get(key: string): string;
  del(key: string): void;
}

export interface RedisJSONStore {
  set(
    key: string,
    path: string,
    json: RedisJSON,
    opt: NX | XX,
  ): Promise<'OK' | null>;
  get(key: string, path: string): Promise<RedisJSON>;
  del(key: string): void;
}

export type RedisClient = RedisClientType<
  RedisDefaultModules & RedisModules,
  RedisFunctions,
  RedisScripts
>;
