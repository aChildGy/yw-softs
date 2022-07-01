import { DateUtils } from '@app/utils';
import { HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { default: DateUtils.format() })
  createdAt: string;

  /**
   * 角色代号
   */
  @Column()
  roleCode: string;

  @ManyToOne(() => User, (user) => user.roles)
  @HideField()
  user: User;
}
