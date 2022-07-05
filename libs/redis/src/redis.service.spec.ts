import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { REDIS_CLIENT } from './constants';
import { RedisClient } from './interfaces/redis.interface';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: RedisClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: REDIS_CLIENT,
          useValue: {
            connect: jest.fn(),
            on: jest.fn(),
            del: jest.fn(),
            json: {
              set: jest.fn().mockResolvedValue('OK'),
            },
            ft: {
              dropIndex: jest.fn(),
              create: jest.fn().mockResolvedValue('OK'),
            },
            ts: {
              create: jest.fn().mockResolvedValue('OK'),
            },
          },
        },
      ],
    }).compile();

    // 初始化一个应用，来测试init代码
    const app = module.createNestApplication();
    // 触发模块的onModuleInit方法
    app.init();

    service = module.get<RedisService>(RedisService);
    redisClient = module.get<RedisClient>(REDIS_CLIENT);
  });

  it('JSON STORE', async () => {
    const key = 'testK1';
    const JSON = { a: '1' };
    // 测试JSON Store.set
    await (await service.getJsonStore()).set(key, '$', JSON);
    expect(redisClient.json.set).toBeCalledWith(
      `JsonStore-${key}`,
      '$',
      JSON,
      null,
    );
    expect(redisClient.json.set).toBeCalledTimes(1);
  });
});
