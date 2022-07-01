import { APP_COMMON_CONFIG } from './constants';
import { registerAs } from '@nestjs/config';

export default {
  register: registerAs(APP_COMMON_CONFIG, () => ({
    port: parseInt(process.env.yws_app_port, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || process.env.yws_app_env,
  })),
  key: APP_COMMON_CONFIG,
};
