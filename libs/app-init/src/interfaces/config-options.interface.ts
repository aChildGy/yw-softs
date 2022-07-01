import { ConfigFactory } from '@nestjs/config';

export interface ConfigOptions {
  /**
   * 配置文件路径
   */
  envFilePath: string;

  /**
   * 传入工厂函数，把环境变量的配置转成对象
   */
  configLoads?: Array<ConfigFactory>;

  /**
   * config模型校验
   */
  validationSchema?: any;
  /**
   * gql模块相关配置
   */
}
