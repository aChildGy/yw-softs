import { CryptoUtils } from '@app/utils';
import { ExecutionContext, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import {
  AUTH_MODULE_OPTIONS,
  IS_PUBLIC_KEY,
  JWT_STRATEGY,
} from '../../constants';
import { AuthModuleOptions } from '../../interfaces/auth.module.options.interface';

/**
 * JWT认证守卫，验证JWT的合法性，来通过授权
 */
@Injectable()
export class JwtAuthGuard
  extends AuthGuard(JWT_STRATEGY)
  implements OnModuleInit
{
  private authModuleOptions: AuthModuleOptions;
  constructor(private moduleRef: ModuleRef, private reflector: Reflector) {
    super();
  }

  onModuleInit() {
    this.authModuleOptions = this.moduleRef.get<AuthModuleOptions>(
      AUTH_MODULE_OPTIONS,
      { strict: false },
    );
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isJWTPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isJWTPublic) {
      return true;
    }

    let request: any;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }
    if (!request.headers.authorization) {
      return false;
    }

    // aes-256-ctr解码
    request.headers.authorization = await CryptoUtils.decrypt(
      request.headers.authorization,
      this.authModuleOptions.cryptoOptions.sign,
      this.authModuleOptions.cryptoOptions.iv,
    );

    return await super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    } else if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
  }

  // handleRequest(err, user, info) {
  //   // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user; //
  // }
}

// if (host.getType() === 'http') {
//     // do something that is only important in the context of regular HTTP requests (REST)
//   } else if (host.getType() === 'rpc') {
//     // do something that is only important in the context of Microservice requests
//   } else if (host.getType<GqlContextType>() === 'graphql') {
//     // do something that is only important in the context of GraphQL requests
//   }
