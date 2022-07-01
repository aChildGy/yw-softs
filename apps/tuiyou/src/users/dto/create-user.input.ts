import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  /**
   * 用户账号
   */
  username: string;

  /**
   * 登录密码
   */
  password: string;

  /**
   * 昵称
   */
  nickname: string;
}
