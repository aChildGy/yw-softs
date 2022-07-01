import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { BaseUserDTOFields } from '../interfaces/auth.user.object.interface';
import { LOCAL_STRATEGY } from '../constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<BaseUserDTOFields> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
