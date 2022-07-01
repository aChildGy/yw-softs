import { APP_COMMON_CONFIG } from './constants';
import { registerAs } from '@nestjs/config';

export default {
  register: registerAs(APP_COMMON_CONFIG, () => ({
    port: parseInt(process.env.yws_app_port, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || process.env.yws_app_env,
    throttle_ttl: parseInt(process.env.yws_app_throttle_ttl, 10) || 60,
    throttle_limit: parseInt(process.env.yws_app_throttle_limit, 10) || 10,
  })),
  key: APP_COMMON_CONFIG,
};
