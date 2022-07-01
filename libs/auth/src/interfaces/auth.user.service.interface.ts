import { IAuthUserObject } from './auth.user.object.interface';
import { IRequestCtx } from './request-ctx.interface';

export interface IAuthUserService {
  findUserByUsername(
    reqCtx: IRequestCtx,
    username: string,
  ): Promise<IAuthUserObject>;
}
