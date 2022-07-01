import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategys/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import { AuthModuleOptions } from './interfaces/auth.module.options.interface';
import { AUTH_MODULE_OPTIONS } from './constants';

@Module({})
export class AuthModule {
  static register(authModuleOptions: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        JwtModule.register({
          secret: authModuleOptions.jwtOptions.secret,
          signOptions: { expiresIn: authModuleOptions.jwtOptions.expiresIn },
        }),
        ...authModuleOptions.imports,
      ],
      providers: [
        PassportModule,
        AuthService,
        LocalStrategy,
        JwtStrategy,
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: authModuleOptions,
        },
        ...authModuleOptions.providers,
      ],
      exports: [LocalStrategy, AuthService],
    };
  }
}
