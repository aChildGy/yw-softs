import { InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  /**
   * 用户账号
   */
  username: string;

  /**
   * 登录密码
   */
  password: string;
}
