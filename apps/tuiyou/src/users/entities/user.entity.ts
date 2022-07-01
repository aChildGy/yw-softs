import { DateUtils } from '@app/utils';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserDetail } from './user.detail.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column('datetime', { default: DateUtils.format() })
  createdAt: string;

  @Column('datetime', { default: DateUtils.format() })
  modifyAt: string;

  /**
   * 用户头像
   */
  @Column({ nullable: true })
  avatar?: string;

  /**
   * 用户账号
   */
  @Column()
  username: string;

  /**
   * 手机号
   */
  @Column({ default: '' })
  phone: string;

  /**
   * 登录密码
   */
  @Column()
  password: string;

  /**
   * 确认密码 / 交易密码
   */
  @Column({ default: '' })
  payPassword?: string;

  /**
   * 昵称
   */
  @Column()
  nickname: string;

  /**
   * 当前余额(单位为分)
   */
  @Column({ default: 0 })
  nowMoney: number;

  /**
   * 当前余额的尾数部分。
   * 如用户余额字段nowMoney字保存1023，尾数字段存储4567。两个字段合在一起表示用户余额为10.234567元
   */
  @Column({ width: 4, default: 0 })
  nowMoneyMantissa: number;

  /**
   * 用户详细信息
   */
  @OneToOne(() => UserDetail)
  @JoinColumn()
  detailInfo: UserDetail;

  /**
   * 用户系统角色
   */
  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    cascade: true,
  })
  roles: UserRole[];

  /**
   * 用户状态(开启/锁定)
   */
  @Column({ default: true })
  isActive: boolean;
}
