import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  /**
   * 登录密码
   */
  @Field(() => Int)
  id: number;

  /**
   * 登录密码
   */
  password?: string;

  /**
   * 昵称
   */
  nickname?: string;

  /**
   * 用户头像
   */
  avatar?: string;

  /**
   * 确认密码 / 交易密码
   */
  payPassword?: string;

  /**
   * 当前余额(单位为分), 充值余额的时候用此字段
   */
  nowMoney?: number;

  /**
   * 用户详细信息
   */
  // detailInfo: UserDetail;

  /**
   * 用户角色
   */
  roles?: string[];

  /**
   * 用户状态(开启/锁定)
   */
  isActive?: boolean;
}
