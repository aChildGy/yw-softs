import { DataSourceOptions } from 'typeorm';

export interface DatabaseConfigOptions {
  /**
   * 数据源的名称
   */
  connectionName: string;

  /**
   *
   * 可传入一个key值，底层通过configService.get(key)方法，获取配置文件中相关配置，返回一个连接配置对象。
   * 或者直接传入typeorm 数据库连接配置对象
   */
  connOptionsOrConnConfigKey: DataSourceOptions | string;

  /**
   * orm框架数据源中的实体。对应多数据源分库操作，例如业务数据存在mysql中，日志存在sqlite中
   */
  entities: any[];

  /**
   * 多数据源情况下，指定默认数据源，多数据源情况下，只有能有一个默认数据源。设置多个默认数据源，会冲突覆盖
   */
  defaultConnection?: boolean;
}
