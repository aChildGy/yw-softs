import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.req.res };
    } else if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      return { req: request, res: response };
    }
  }
}
