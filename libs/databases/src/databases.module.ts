import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // TypeOrmModuleAsyncOptions
import { DataSource, DataSourceOptions } from 'typeorm';
// import { createConnection } from 'typeorm';
import { DatabaseConfigOptions } from './interfaces/database-config-options.interface';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       useClass: DatabasesConfigService,
//     }),
//     // 多数据源支持
//     // TypeOrmModule.forRootAsync({
//     //   useClass: DatabasesConfigService,
//     // }),
//   ],
// })
// export class DatabasesModule {}

// 动态模块模式 register方法 可以传递参数，动态返回DynamicModule
@Module({})
export class DatabasesModule {
  /**
   * 通过指定配置文件中的配置，以及配置实体数据。来设置数据源
   * @param opts
   * @returns
   */
  static register(opts: DatabaseConfigOptions[]): DynamicModule {
    const dbImports = [];
    for (const opt of opts) {
      dbImports.push(
        TypeOrmModule.forRootAsync({
          name: opt.defaultConnection ? 'default' : opt.connectionName,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            let connOptions: DataSourceOptions;
            if (typeof opt.connOptionsOrConnConfigKey === 'string') {
              connOptions = configService.get<DataSourceOptions>(
                <string>opt.connOptionsOrConnConfigKey,
              );
            } else {
              connOptions = <DataSourceOptions>opt.connOptionsOrConnConfigKey;
            }

            return <TypeOrmModuleOptions>{
              ...connOptions,
              entities: opt.entities,
              // entities: ['dist/**/*.entity{.ts,.js}'], 这是另一种静态加载实体的配置
              autoLoadEntities: false, // 自动加载实体， 自动加载TypeOrmModule.forFeature方法参数的实体。单数据源的情况下可以设置为true，就不需要配置entities属性了
            };
          },
          // dataSource receives the configured DataSourceOptions and returns a Promise<DataSource>.
          dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
          },
        }),
      );
    }
    return {
      global: true,
      module: DatabasesModule,
      imports: dbImports,
    };
  }
}
