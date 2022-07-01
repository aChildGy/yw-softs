// import { DateUtils } from '@app/utils';
// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { LogStatus } from '../constants';

// @Entity()
// export class AppExceptionLogs {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   message: string;

//   @Column()
//   context: string;

//   @Column('text')
//   stack: string;

//   @Column('varchar', { length: 5 })
//   level: string;

//   @Column('int', { width: 1, default: LogStatus.Unconfirmed })
//   status: number;

//   @Column('datetime', { default: DateUtils.format() }) // 在工具类里 提供提供此值
//   createdAt: string;
// }
