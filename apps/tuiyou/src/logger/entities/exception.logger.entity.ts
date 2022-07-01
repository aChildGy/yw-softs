import { ExceptionLoggerEntity } from '@app/logger';
import { DateUtils } from '@app/utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/**
 * 日志状态
 */
export enum LogStatus {
  /**
   * 错误日志未确认(默认状态)
   */
  Unconfirmed = 0,
  /**
   * 错误日志已确认
   */
  Confirmed = 1,
}

@Entity()
export class ExceptionLogger implements ExceptionLoggerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { default: DateUtils.format() }) // 在工具类里 提供提供此值
  createdAt: string;

  @Column('text')
  message: string;

  @Column()
  context: string;

  @Column('text', { nullable: true })
  stack: string;

  @Column('varchar', { length: 5 })
  level: string;

  @Column('int', { width: 1, default: LogStatus.Unconfirmed })
  status: number;
}
