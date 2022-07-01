import { Utils } from '@app/utils';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { object } from 'joi';
import { Repository } from 'typeorm';
import { CONNECTION_NAME, EXCEPTION_LOGGER_ENTITY } from './constants';
import { ExceptionLoggerEntity } from './interfaces/exception-logger-entity.interface';

export class AppLogger extends ConsoleLogger implements OnModuleInit {
  private appExceptionLoogerRepository: Repository<ExceptionLoggerEntity>;
  private logId: string = Utils.uuid();
  constructor(
    private moduleRef: ModuleRef,
    @Inject(CONNECTION_NAME)
    private readonly connectionName: string,
    @Inject(EXCEPTION_LOGGER_ENTITY)
    private readonly ExceptionLoggerEntityClass: new () => ExceptionLoggerEntity,
  ) {
    super();
  }
  onModuleInit() {
    /**
     * this.moduleRef.get 方法的第二个参数，表示是否可以从全局获取引用。strict默认为true。限制只能获取本模块的提供者引用
     */
    if (this.connectionName && this.ExceptionLoggerEntityClass) {
      this.appExceptionLoogerRepository = this.moduleRef.get(
        getRepositoryToken(
          this.ExceptionLoggerEntityClass,
          this.connectionName,
        ),
        { strict: false },
      );
    }
  }

  log(message: any, context?: string) {
    super.setContext(context ? `${this.logId}] [${context}` : `${this.logId}`);
    super.log(message);
  }

  debug(message: any, context?: string) {
    super.setContext(context ? `${this.logId}] [${context}` : `${this.logId}`);
    super.debug(message);
  }

  verbose(message: any, context?: string) {
    super.setContext(context ? `${this.logId}] [${context}` : `${this.logId}`);
    super.verbose(message);
  }

  // 扩展日志的warn方法
  warn(message: any, context?: string) {
    super.setContext(context ? `${this.logId}] [${context}` : `${this.logId}`);
    // 警告日志存储到数据库中
    // if (context) {
    //   if (this.appExceptionLoogerRepository) {
    //     this.appExceptionLoogerRepository.save({
    //       message,
    //       context,
    //       level: 'warn',
    //     });
    //   }
    // }
    super.warn(message);
  }

  // 扩展日志的error方法
  error(message: any, stack?: string, context?: string) {
    // 错误日志存储到数据库中

    super.setContext(context ? `${this.logId}] [${context}` : `${this.logId}`);

    if (stack) {
      if (this.appExceptionLoogerRepository) {
        this.appExceptionLoogerRepository.save({
          message,
          stack,
          context,
          level: 'error',
        });
      }
      super.error(message, stack);
    } else {
      super.error(message);
    }
  }
}

/**
 * 不输出任何日志信息
 */
export const VoidAppLogger = Object.create(null);
VoidAppLogger.log = () => ({});
VoidAppLogger.debug = () => ({});
VoidAppLogger.verbose = () => ({});
VoidAppLogger.warn = () => ({});
VoidAppLogger.error = () => ({});
