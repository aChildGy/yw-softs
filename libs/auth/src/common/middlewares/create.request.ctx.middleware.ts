import { REQUEST_CTX } from '@app/auth/constants';
import { IRequestCtx } from '@app/auth/interfaces/request-ctx.interface';
import { AppLogger, ExceptionLoggerEntity } from '@app/logger';
import {
  CONNECTION_NAME,
  EXCEPTION_LOGGER_ENTITY,
} from '@app/logger/constants';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CreateRequestCtxMiddleware implements NestMiddleware {
  constructor(
    private moduleRef: ModuleRef,
    @Inject(CONNECTION_NAME)
    private readonly connectionName: string,
    @Inject(EXCEPTION_LOGGER_ENTITY)
    private readonly ExceptionLoggerEntityClass: new () => ExceptionLoggerEntity,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 若是apollo的自省查询。直接next()
    if (req.body?.operationName === 'IntrospectionQuery') {
      await next();
      return;
    }

    const logger = new AppLogger(
      this.moduleRef,
      this.connectionName,
      this.ExceptionLoggerEntityClass,
    );
    logger.onModuleInit();
    const reqCtx: IRequestCtx = {
      logger: logger,
    };

    req[REQUEST_CTX] = reqCtx;

    await next();
  }
}

// 第二种写法(不需要DI注入的情况 可以用这种简写形式)
// import { Logger } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// export async function logger(req: Request, res: Response, next: NextFunction) {
//   const logger = new Logger('logger');

//   // 若是apollo的自省查询。直接next()
//   if (req.body?.operationName === 'IntrospectionQuery') {
//     await next();
//     return;
//   }

//   const nowDate = Date.now();

//   logger.log(`Request Start ---> ${req.body?.operationName}`);
//   await next();
//   logger.log(`Request End ---> ${nowDate - Date.now()}ms`);
//   console.log(`Request End ---> ${nowDate - Date.now()}ms`);
// }
