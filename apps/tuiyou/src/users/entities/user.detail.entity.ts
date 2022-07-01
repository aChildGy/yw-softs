import { DateUtils } from '@app/utils';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class UserDetail {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column('datetime', { default: DateUtils.format() })
  createdAt: string;

  @Column('datetime', { default: DateUtils.format() })
  modifyAt: string;

  /**
   * 真实姓名
   */
  @Column({ default: '' })
  realName: string;

  /**
   * 身份证号
   */
  @Column({ default: '' })
  IDCode: string;

  /**
   * 性别
   */
  @Column({ default: '' })
  sex: string;

  /**
   * 地址
   */
  @Column({ default: '' })
  addres: string;

  /**
   * 生日
   */
  @Column({ default: '' })
  birthday: string;

  /**
   * 用户备注
   */
  @Column({ default: '' })
  notes: string;
}
