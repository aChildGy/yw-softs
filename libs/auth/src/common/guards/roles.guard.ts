import { IS_PUBLIC_KEY, ROLES_KEY } from '@app/auth/constants';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { map } from 'lodash';

@Injectable()
export class RolesGuard<T> implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isJWTPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isJWTPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<T[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 不需要指定权限访问的接口
    if (!requiredRoles) {
      return true;
    }

    let request: any;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    const user = request.user;
    if (!user || !user.roles) {
      return false;
    }

    const userRoles = map(user.roles, (user) => user.roleCode);

    return requiredRoles.some((role) => userRoles?.includes(role));

    // if (host.getType() === 'http') {
    //     // do something that is only important in the context of regular HTTP requests (REST)
    //   } else if (host.getType() === 'rpc') {
    //     // do something that is only important in the context of Microservice requests
    //   } else if (host.getType<GqlContextType>() === 'graphql') {
    //     // do something that is only important in the context of GraphQL requests
    //   }
  }
}
