import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CheckRequestSizeMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // 若是apollo的自省查询。直接next()
    if (req.body?.operationName === 'IntrospectionQuery') {
      await next();
      return;
    }

    // 判断jwt的大小。最大不超过6KB
    const maxAuthorizationSize = 6144; // 6KB
    // 因为jwt加密后是16进制的加密串，都是数字和字母组成，所以直接length来判断字节数。 PS: 一个数字或字母占用一个字节空间
    if (req.headers.authorization?.length > maxAuthorizationSize) {
      // res.status(417);
      // res.end(JSON.stringify({ success: false, message: 'JWT Token Too Large！' }));
      throw new BadRequestException('JWT Token Too Large');
    }

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
