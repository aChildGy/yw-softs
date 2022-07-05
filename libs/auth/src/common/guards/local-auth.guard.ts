import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL_STRATEGY } from '../../constants';

/**
 * 本地认证守卫，验证账号密码的合法性，来通过授权。
 * 通过授权的请求，在request对象上会自动添加user属性
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {
  getRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    } else if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
  }
}
