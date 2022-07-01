import { IRequestCtx } from '@app/auth/interfaces/request-ctx.interface';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { REQUEST_CTX } from '../../constants';

@Injectable()
export class UpdateRequestCtxInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const reqCtx: IRequestCtx = req[REQUEST_CTX];

    reqCtx.user = req.user;

    req[REQUEST_CTX] = reqCtx;

    return next.handle();
  }
}
