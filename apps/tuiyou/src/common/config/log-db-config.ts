import { registerAs } from '@nestjs/config';
import { BetterSqlite3ConnectionOptions } from 'typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions';
import { LOG_DB_CONFIG } from './constants';

export default {
  register: registerAs(LOG_DB_CONFIG, () => {
    const envConfig = process.env;

    const LOG_DB_PREFIX = 'yws_app_sqlite3_log_db';

    return <BetterSqlite3ConnectionOptions>{
      type: envConfig[`${LOG_DB_PREFIX}_type`],
      database: envConfig[`${LOG_DB_PREFIX}_database`],
      synchronize: Boolean(envConfig[`${LOG_DB_PREFIX}_synchronize`]),
    };
  }),
  key: LOG_DB_CONFIG,
};
