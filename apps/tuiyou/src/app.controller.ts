import { AuthService, LocalAuthGuard, PublicApi, Roles } from '@app/auth';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  HttpCode,
} from '@nestjs/common';
import { Role } from './users/constants';
import { join } from 'path';
import { DateUtils } from '@app/utils';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService, // private caslAbilityFactory: CaslAbilityFactory<TT>,
  ) {}

  // @Version('2')
  // @PublicApiOfJWT()
  // @UseInterceptors(LoggingInterceptor)

  // 登录接口
  @Post('auth/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @PublicApi()
  async login(@Request() req) {
    // JWT TOKEN方式
    return this.authService.login(req.user);
  }

  @Get('profile')
  @Roles<Role>(Role.Member)
  async getProfile(@Request() req) {
    return req.user;
  }

  // 登录接口
  @Get('app/heapdump')
  @HttpCode(200)
  @PublicApi()
  async createHeapdump() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const heapdump = require('heapdump');
    const filename = join(
      'heapsnapshots',
      `${DateUtils.format(new Date(), `YYYY-MM-DD HH_mm_ss`)}.heapsnapshot`,
    );

    return new Promise((resolve, reject) => {
      heapdump.writeSnapshot(filename, function (err, filename) {
        if (err) {
          console.log(err);
          reject(`快照生成失败: ${err.message}`);
          return;
        }
        console.log('快照写入文件:', filename);
        resolve(`快照生成成功: ${filename}`);
        return;
      });
    });
  }
}
