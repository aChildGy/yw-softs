import { registerAs } from '@nestjs/config';
import { REDIS_CONFIG } from './constants';

export default {
  register: registerAs(REDIS_CONFIG, () => {
    const envConfig = process.env;

    const REDIS_DB_PREFIX = 'yws_app_redis';

    return {
      host: envConfig[`${REDIS_DB_PREFIX}_host`],
      port: envConfig[`${REDIS_DB_PREFIX}_port`] || 6379,
      username: envConfig[`${REDIS_DB_PREFIX}_username`] || undefined,
      password: envConfig[`${REDIS_DB_PREFIX}_password`] || undefined,
    };
  }),
  key: REDIS_CONFIG,
};
