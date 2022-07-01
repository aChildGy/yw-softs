import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLogger } from './logger.service';
import { LoggerConfigOptions } from './interfaces/logger-config-options.interface';
import { CONNECTION_NAME, EXCEPTION_LOGGER_ENTITY } from './constants';

@Global()
@Module({})
export class AppLoggerModule {
  /**
   * 通过指定配置文件中的配置，以及配置实体数据。来设置数据源
   * @param opts
   * @returns
   */
  static forFeature(loggerConfigOptions: LoggerConfigOptions): DynamicModule {
    const imports = [];
    if (
      loggerConfigOptions.connectionName &&
      loggerConfigOptions.ExceptionLoggerEntity
    ) {
      imports.push(
        TypeOrmModule.forFeature(
          [loggerConfigOptions.ExceptionLoggerEntity],
          loggerConfigOptions.connectionName,
        ),
      );
    }
    return {
      module: AppLoggerModule,
      imports: imports,
      providers: [
        {
          provide: CONNECTION_NAME,
          useValue: loggerConfigOptions.connectionName || null,
        },
        {
          provide: EXCEPTION_LOGGER_ENTITY,
          useValue: loggerConfigOptions.ExceptionLoggerEntity || null,
        },
      ],
      exports: [CONNECTION_NAME, EXCEPTION_LOGGER_ENTITY],
    };
  }
}
