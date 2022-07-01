import { ConfigOptions } from './config-options.interface';
import { GraphQLOptions } from './graphql-options.interface';

// ConfigFactory的源码，供参考学习之用

// export type ConfigObject = Record<string, any>;

// type ConfigFactoryReturnValue<T extends ConfigObject> = T | Promise<T>;

// export type ConfigFactory<T extends ConfigObject = ConfigObject> =
//   () => ConfigFactoryReturnValue<T>;

export interface AppInitOptions {
  /**
   * 应用Config模块相关配置
   */
  configOptions: ConfigOptions;

  /**
   * GraphQLApolloDriver相关配置，若配置此配置，则应用启动GraphQL模块
   */
  graphQLOptions?: GraphQLOptions;

  /**
   * 是否启用限流器
   * 配置文件参数:
   *    yws_app_throttle_ttl -- 每个请求/接口将在存储中持续的秒数, 默认60
   *    yws_app_throttle_limit -- TTL 限制内的最大请求数, 默认10
   */
  throttler?: boolean;
}
