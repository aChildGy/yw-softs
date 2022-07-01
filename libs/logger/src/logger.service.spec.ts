import { ConsoleLogger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogger } from './logger.service';
import { CONNECTION_NAME, EXCEPTION_LOGGER_ENTITY } from './constants';

const exceptionLogsArray = [
  {
    id: 1,
    message: 'test logger message #1',
    context: 'AppLoggerTest',
    stack: 'test stack of string #1',
  },
  {
    id: 2,
    message: 'test logger message #2',
    context: 'AppLoggerTest',
    stack: 'test stack of string #2',
  },
];

const oneExceptionLog = {
  id: 1,
  message: 'test logger message #1',
  context: 'AppLoggerTest',
  stack: 'test stack of string #1',
};

const connectionName = 'test-log-db';
class ExceptionLogger {}

describe('AppLoggerService', () => {
  // 表示测试的数据准备，例如初始化类，设置变量的初始值等。

  let loggerService: AppLogger;
  let repository: Repository<ExceptionLogger>;

  let mockedSuperErrorFn: jest.SpyInstance;
  let mockedSuperWarnFn: jest.SpyInstance;

  beforeEach(async () => {
    // jest.spyOn 可能因为object[methodName]模型的方式。会存在缓存，需要用到mockClear方法来清楚脏数据

    // Mock 父类的error方法
    mockedSuperErrorFn = jest
      .spyOn(ConsoleLogger.prototype, 'error')
      .mockImplementation((_) => _);

    mockedSuperWarnFn = jest
      .spyOn(ConsoleLogger.prototype, 'warn')
      .mockImplementation((_) => _);

    const providers = [];
    if (connectionName) {
      providers.push(
        // 数据库隔离测试
        {
          provide: getRepositoryToken(ExceptionLogger, connectionName),
          useValue: {
            find: jest.fn().mockResolvedValue(exceptionLogsArray),
            findOne: jest.fn().mockResolvedValue(oneExceptionLog),
            save: jest.fn().mockResolvedValue(oneExceptionLog),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      );
    }
    // createTestingModule 会返回新的module实例。DI依赖数也是新生成的
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLogger,
        {
          provide: CONNECTION_NAME,
          useValue: connectionName,
        },
        {
          provide: EXCEPTION_LOGGER_ENTITY,
          useValue: ExceptionLogger,
        },
        ...providers,
      ],
    }).compile();

    // 初始化一个应用，来测试init代码
    const app = module.createNestApplication();
    // 触发模块的onModuleInit方法
    app.init();

    loggerService = module.get<AppLogger>(AppLogger);
    repository = module.get<Repository<ExceptionLogger>>(
      getRepositoryToken(ExceptionLogger, connectionName),
    );
  });

  // afterEach(() => {
  //   mockedSuperErrorFn.mockClear();
  //   mockedSuperWarnFn.mockClear();
  //   // (<jest.Mock>repository.save).mockClear();
  // });

  describe('test logger error function', () => {
    it('logger error by 1 params', () => {
      // 表示执行单测的核心代码。
      const errorMsg = 'test error print by 1 params';

      loggerService.error(errorMsg);

      // repository.save 未被调用
      expect(repository.save).toHaveReturnedTimes(0);

      // super.error 被调用一次
      expect(mockedSuperErrorFn).toHaveReturnedTimes(1);
      // super.error 使用指定参数调用
      expect(mockedSuperErrorFn).toBeCalledWith(errorMsg);
    });

    it('logger error by 2 params', () => {
      const errorMsg = 'test error print by 2 params';
      const stack = 'test context of string ';
      loggerService.error(errorMsg, stack);

      // 调用一次数据库方法
      expect(repository.save).toHaveReturnedTimes(1);
      expect(repository.save).toBeCalledWith({
        message: errorMsg,
        stack,
        context: undefined,
        level: 'error',
      });

      expect(mockedSuperErrorFn).toHaveReturnedTimes(1);
      // super.error 使用指定参数调用
      expect(mockedSuperErrorFn).toBeCalledWith(errorMsg, stack);
    });
  });

  // describe('test logger warn function', () => {
  //   it('logger warn by 1 params', () => {
  //     const warnMsg = 'test warn print by 1 params';
  //     loggerService.warn(warnMsg);
  //     // 调用一次数据库方法
  //     expect(repository.save).toHaveReturnedTimes(0);
  //     expect(mockedSuperWarnFn).toHaveReturnedTimes(1);
  //     expect(mockedSuperWarnFn).toBeCalledWith(warnMsg);
  //   });

  //   it('logger warn by 2 params', () => {
  //     const warnMsg = 'test warn print by 2 params';
  //     const context = 'the test context ';
  //     loggerService.warn(warnMsg, context);
  //     // 调用一次数据库方法
  //     expect(repository.save).toHaveReturnedTimes(1);
  //     expect(repository.save).toBeCalledWith({
  //       message: warnMsg,
  //       context,
  //       level: 'warn',
  //     });
  //     expect(mockedSuperWarnFn).toHaveReturnedTimes(1);
  //     expect(mockedSuperWarnFn).toBeCalledWith(warnMsg, context);
  //   });
  // });
});
