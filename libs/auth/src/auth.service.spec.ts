import { CryptoUtils } from '@app/utils';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AUTH_MODULE_OPTIONS, USER_SERVICE } from './constants';
import { IAuthUserService } from './interfaces/auth.user.service.interface';
import { AuthModuleOptions } from './interfaces/auth.module.options.interface';
import { IRequestCtx } from './interfaces/request-ctx.interface';
import { VoidAppLogger } from '@app/logger';

const authModuleOptions: AuthModuleOptions = {
  jwtOptions: {
    secret: '123456',
    expiresIn: '1h',
  },
  cryptoOptions: {
    sign: '123456',
    iv: '21234a89d249712f3d7ecc381c5c7c54',
  },
  imports: [],
  providers: [],
};

const reqCtx: IRequestCtx = {
  logger: VoidAppLogger,
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: IAuthUserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'a secret key',
          signOptions: { expiresIn: '12h' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: {},
        },
        {
          provide: USER_SERVICE,
          useValue: {
            findUserByUsername: jest
              .fn()
              .mockImplementation(async (rtx, username) => {
                const userObj = {
                  id: 1,
                  username: 'zhangsan',
                  password: await CryptoUtils.generateHash('1234567'),
                };
                if (userObj.username === username) {
                  return userObj;
                } else {
                  return null;
                }
              }),
          },
        },
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: authModuleOptions,
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userService = module.get<IAuthUserService>(USER_SERVICE);
    jwtService = module.get(JwtService);

    jwtService.sign = jest.fn().mockImplementation(jwtService.sign);
  });

  it('test validateUser func，输入有效的用户名和密码 ', async () => {
    const username = 'zhangsan';
    const password = '1234567';

    expect(await service.validateUser(username, password)).toEqual({
      id: 1,
      username: 'zhangsan',
    });

    // findUserByUsername 被调用一次
    expect(userService.findUserByUsername).toHaveReturnedTimes(1);

    // findUserByUsername 返回正确的用户
    expect(
      (await userService.findUserByUsername(reqCtx, username)).username,
    ).toBe(username);
  });

  it('test validateUser func，输入无效用户名 ', async () => {
    const username = 'zhangsan1';
    const password = '1234567';

    expect(await service.validateUser(username, password)).toBe(null);

    // findUserByUsername 被调用一次
    expect(userService.findUserByUsername).toHaveReturnedTimes(1);

    // findUserByUsername 返回正确的用户
    expect(await userService.findUserByUsername(reqCtx, username)).toBe(null);
  });

  it('test validateUser func，输入无效密码 ', async () => {
    const username = 'zhangsan';
    const password = '12345671';

    expect(await service.validateUser(username, password)).toBe(null);

    // findUserByUsername 被调用一次
    expect(userService.findUserByUsername).toHaveReturnedTimes(1);

    // findUserByUsername 返回正确的用户
    expect(
      (await userService.findUserByUsername(reqCtx, username)).username,
    ).toBe(username);
  });

  it('test login func，返回二次加密的数据 ', async () => {
    const user = {
      id: 1,
      username: 'zhangsan',
      sub: 1,
    };

    expect(await service.login(user)).not.toBeNull();

    expect(jwtService.sign).toHaveReturnedTimes(1);

    expect(await jwtService.sign(user)).not.toBeNull();
  });
});
