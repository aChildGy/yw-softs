import { IRequestCtx } from '@app/auth';
import { REQUEST_CTX } from '@app/auth/constants';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ReqToResTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const reqRtx = <IRequestCtx>ctx.getContext().req[REQUEST_CTX];
    const { logger, user } = reqRtx;
    logger.log(`===>`, ReqToResTimeInterceptor.name);
    logger.log(
      `${user ? `当前请求用户: ${JSON.stringify(user)}` : 'Public API'}`,
      ReqToResTimeInterceptor.name,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        logger.log(`<=== ${Date.now() - now}ms`, ReqToResTimeInterceptor.name);
        return null;
      }),
    );
  }
}
