import { Inject, Injectable } from '@nestjs/common';
import {
  BaseUserDTOFields,
  IAuthUserObject,
  IJWTUserObject,
} from './interfaces/auth.user.object.interface';
import { IAuthUserService } from './interfaces/auth.user.service.interface';

import { JwtService } from '@nestjs/jwt';
import { CryptoUtils } from '@app/utils';
import { AUTH_MODULE_OPTIONS, USER_SERVICE } from './constants';
import { AuthModuleOptions } from './interfaces/auth.module.options.interface';
import { IRequestCtx } from './interfaces/request-ctx.interface';
import { VoidAppLogger } from '@app/logger';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(AUTH_MODULE_OPTIONS) private authModuleOptions: AuthModuleOptions,
    @Inject(USER_SERVICE) private userService: IAuthUserService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<BaseUserDTOFields> {
    // 策略校验，默认不输出日志
    const reqCtx: IRequestCtx = {
      logger: VoidAppLogger,
    };
    const user: IAuthUserObject = await this.userService.findUserByUsername(
      reqCtx,
      username,
    );

    if (user && (await CryptoUtils.compareHash(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateJwtData(JWTData: IJWTUserObject): Promise<IJWTUserObject> {
    // iss: jwt签发者
    // sub: jwt所面向的用户
    // aud: 接收jwt的一方
    // exp: jwt的过期时间，这个过期时间必须要大于签发时间
    // nbf: 定义在什么时间之前，该jwt都是不可用的.
    // iat: jwt的签发时间
    // jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

    // JWT使用建议
    // 不要存放敏感信息，除非对jwt二次加密 ----- √ 已做加密处理
    // jwt有效时间不宜设置过长 ----- √ 设置12小时有效
    // 开启only http 预防XSS攻击 ----- √ 启用helmet插件
    // 如果担心重放攻击，可以设置jti，使JWT变为一次性token ----- TODO 用redis来作为存储库
    // 应用程序层增加黑名单机制，必要的时候可以手动。（这是令牌被第三方窃取后的手动防御 ----- TODO 增加黑名单机制，用redis/mysql作为存储库

    return JWTData;
  }

  async login(user: IJWTUserObject) {
    const JWTData: IJWTUserObject = {
      ...user,
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: await CryptoUtils.encrypt(
        `Bearer ${this.jwtService.sign(JWTData)}`,
        this.authModuleOptions.cryptoOptions.sign,
        this.authModuleOptions.cryptoOptions.iv,
      ),
    };
  }
}
