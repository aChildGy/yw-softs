import { func } from 'joi';
import {
  SchemaFieldTypes,
  TimeSeriesDuplicatePolicies,
  TimeSeriesEncoding,
} from 'redis';
import { RedisClient } from '../constants';

export const CheckRedisModule = async (client: RedisClient) => {
  const msg = '服务启动失败，模块功能校验未通过';

  // 验证redis-json模块
  await checkRedisJsonModule(client, msg);

  // 验证redis-search模块
  await checkRediSearchModule(client, msg);

  // 验证验证redis-time-series模块
  await checkRediTimeSeriesModule(client, msg);

  // // 验证验证redis-graph模块
  // await checkGraphModule(client, msg);

  // // 验证验证redis-bloom模块
  // await checkBloomModule(client, msg);
};

async function checkRedisJsonModule(client: RedisClient, msg: string) {
  // 若代码正常执行且没报错，则需求的redis模块在服务器上已正常启用

  // 验证redis-json模块
  const testKey = `test-redis-josn${Date.now()}`;
  try {
    const created = await client.json.set(testKey, '$', { key: 'val' });

    if (created !== 'OK') {
      throw new Error(`${msg}: 请检查redis-josn模块是否正确加载`);
    }
  } catch (e) {
    console.error(e);
    throw new Error(`${msg}: 请检查redis-josn模块是否正确加载`);
  } finally {
    await client.del(testKey);
  }
}

async function checkRediSearchModule(client: RedisClient, msg: string) {
  const testIndexKey = `test-redis-search${Date.now()}`;

  const schema: any = {
    '$.age': {
      type: SchemaFieldTypes.NUMERIC,
      AS: 'age',
    },
  };

  try {
    // Create an index.
    const created = await client.ft.create(`idx:${testIndexKey}`, schema, {
      ON: 'JSON',
      PREFIX: `noderedis:${testIndexKey}`,
    });

    if (created !== 'OK') {
      throw new Error(`${msg}: 请检查redis-search模块是否正确加载`);
    }
  } catch (e) {
    console.error(e);
    throw new Error(`${msg}: 请检查redis-search模块是否正确加载`);
  } finally {
    await client.ft.dropIndex(`idx:${testIndexKey}`, { DD: true });

    // 删除所有索引以及相关联文档
    //   const indexList = await client.ft._list();
    //   for (const iterator of indexList) {
    //     await client.ft.dropIndex(iterator, { DD: true });
    //   }
  }
}

async function checkRediTimeSeriesModule(client: RedisClient, msg: string) {
  // 若代码正常执行且没报错，则需求的redis模块在服务器上已正常启用
  const testKey = `test-redis-time-series${Date.now()}`;

  try {
    // 验证redis-json模块
    const created = await client.ts.create(testKey, {
      RETENTION: 86400000, // 1 day in milliseconds
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED, // No compression
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK, // No duplicates
    });

    if (created !== 'OK') {
      throw new Error(`${msg}: 请检查redis-time-series模块是否正确加载`);
    }
  } catch (e) {
    console.error(e);
    throw new Error(`${msg}: 请检查redis-time-series模块是否正确加载`);
  } finally {
    await client.del(testKey);
  }
}

async function checkGraphModule(client: RedisClient, msg: string) {
  // 若代码正常执行且没报错，则需求的redis模块在服务器上已正常启用
  const testKey = `test-redis-graph${Date.now()}`;
  try {
    // 验证redis-graph模块
    const results = await client.graph.query(
      testKey,
      "MATCH (p:president)-[:born]->(:state {name:'Hawaii'}) RETURN p",
    );

    if (!results.headers || results.headers[0] !== 'p') {
      throw new Error(`${msg}: 请检查redis-graph模块是否正确加载`);
    }
  } catch (e) {
    console.error(e);
    throw new Error(`${msg}: 请检查redis-graph模块是否正确加载`);
  } finally {
    await client.del(testKey);
  }
}

async function checkBloomModule(client: RedisClient, msg: string) {
  // 若代码正常执行且没报错，则需求的redis模块在服务器上已正常启用
  const testKey = `test-redis-bloom${Date.now()}`;
  try {
    // 验证redis-bloom模块
    await client.bf.reserve(testKey, 0.01, 1000);
  } catch (e) {
    console.error(e);
    throw new Error(`${msg}: 请检查redis-bloom模块是否正确加载`);
  } finally {
    await client.del(testKey);
  }
}
