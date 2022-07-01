import { registerAs } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { MAIN_DB_CONFIG } from './constants';

export const DB_KEY = MAIN_DB_CONFIG;

export default {
  register: registerAs(MAIN_DB_CONFIG, () => {
    const envConfig = process.env;

    const MAIN_DB_PREFIX = 'yws_app_mysql_main_db';

    return <MysqlConnectionOptions>{
      type: envConfig[`${MAIN_DB_PREFIX}_type`],
      host: envConfig[`${MAIN_DB_PREFIX}_host`],
      port: parseInt(envConfig[`${MAIN_DB_PREFIX}_port`], 10) || 3306,
      username: envConfig[`${MAIN_DB_PREFIX}_username`],
      password: envConfig[`${MAIN_DB_PREFIX}_password`],
      database: envConfig[`${MAIN_DB_PREFIX}_database`],
      synchronize: Boolean(envConfig[`${MAIN_DB_PREFIX}_synchronize`]),
    };
  }),
  key: MAIN_DB_CONFIG,
};
