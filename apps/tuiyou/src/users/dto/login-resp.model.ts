import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResp {
  /**
   * 访问令牌
   */
  accessToken: string;
}
