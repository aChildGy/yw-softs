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
  /**
   * @param key 字符串的key
   * @param val 字符串的值
   * @param ttl 使用ex选项来设定有效时间，数据在指定秒数后失效
   */
  set(key: string, val: string | number, ttl?: number): Promise<'OK' | null>;
  /**
   * @param key 字符串的key
   */
  get(key: string): Promise<string | number | null>;
  del(key: string): Promise<number>;
}

export interface RedisJSONStore {
  /**
   * 存储JSON数据
   * @param key 数据的key
   * @param path JSONPath
   * @param json JSON数据
   * @param opt 可为空，可选值为NX 或者 XX。
   * - NX，当KEY不在redis中存在时，才插入数据。
   * - XX，当KEY已在redis中存在时，才插入数据。
   * @returns 返回OK，数据被正确插入/更新。返回null，数据没有被插入/更新
   */
  set(
    key: string,
    path: string,
    json: RedisJSON,
    opt?: NX | XX,
  ): Promise<'OK' | null>;
  /**
   *
   * @param key 数据的key
   * @param path JSONPath
   */
  get(key: string, path: string): Promise<RedisJSON>;

  /**
   *
   * @param key 数据的key
   * @param path JSONPath
   *
   * @returns 删除的数据条数。一条没删，返回0
   */
  del(key: string, path: string): Promise<number>;
}

export type RedisClient = RedisClientType<
  RedisDefaultModules & RedisModules,
  RedisFunctions,
  RedisScripts
>;
