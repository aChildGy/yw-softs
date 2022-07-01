import { ExceptionLoggerEntity } from './exception-logger-entity.interface';

export interface LoggerConfigOptions {
  /**
   * connection name,传入数据库模块的链接名称，来指定日志存储库，若是不传此参数，则异常日志不会上传到数据库，
   */
  connectionName?: string;

  /**
   * 异常日志记录实体
   */
  ExceptionLoggerEntity?: new () => ExceptionLoggerEntity;
}
