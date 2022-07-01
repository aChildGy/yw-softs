import { REQUEST_CTX } from '@app/auth/constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

export const GqlRequestLogId = createParamDecorator(
  (logId: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req[logId];
  },
);

export const GqlRequestCtx = createParamDecorator(
  (requestCtx: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const reqCtx = ctx.getContext().req[requestCtx || REQUEST_CTX];

    if (!reqCtx) {
      throw new Error('RequestCtx对象 获取失败');
    }
    return reqCtx;
  },
);
