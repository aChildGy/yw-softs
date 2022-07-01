import { omit } from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IJWTUserObject } from '../interfaces/auth.user.object.interface';
import { AuthModuleOptions } from '../interfaces/auth.module.options.interface';
import { AUTH_MODULE_OPTIONS, JWT_STRATEGY } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS) authModuleOptions: AuthModuleOptions,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 是否忽略超时时间，设置为false
      ignoreExpiration: false,
      secretOrKey: authModuleOptions.jwtOptions.secret,
    });
  }

  async validate(payload: IJWTUserObject) {
    //TODO 解码后的数据 要比对一下 数据库中数据是否有效，比如用户的状态是否为开启等等
    const jwtData = await this.authService.validateJwtData(payload);

    // return { userId: payload.sub, username: payload.username };
    return jwtData; //omit();
  }
}
