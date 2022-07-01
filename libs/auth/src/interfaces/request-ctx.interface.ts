import { AppLogger } from '@app/logger';
import { IAuthUserObject } from './auth.user.object.interface';

export interface IRequestCtx {
  /**
   * 日志对象(每个请求，新new一个对象)
   */
  logger: AppLogger;

  /**
   * 登录用户信息
   */
  user?: IAuthUserObject;
}
