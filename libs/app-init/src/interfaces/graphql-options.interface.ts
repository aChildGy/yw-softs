export interface GraphQLOptions {
  /**
   * 代码优先模式的，自动生成模式文件路径 autoSchemaFile
   */
  schemaFilePath: string;

  debug?: boolean;
  playground?: boolean;
}
