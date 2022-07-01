import * as Joi from 'joi';

export default Joi.object({
  // 应用端口
  yws_app_port: Joi.number().required().default(3000),
  yws_app_env: Joi.string().required(),
  // 主数据库
  yws_app_mysql_main_db_type: Joi.string().required(),
  yws_app_mysql_main_db_host: Joi.string().required(),
  yws_app_mysql_main_db_port: Joi.number().required().default(3306),
  yws_app_mysql_main_db_username: Joi.string().required(),
  yws_app_mysql_main_db_password: Joi.string().required(),
  yws_app_mysql_main_db_database: Joi.string().required(),
  yws_app_mysql_main_db_synchronize: Joi.number().valid(1, 0).default(0),

  // 日志数据库
  yws_app_sqlite3_log_db_type: Joi.string().required(),
  yws_app_sqlite3_log_db_database: Joi.string().required(),
  yws_app_sqlite3_log_db_synchronize: Joi.number().valid(1, 0).default(0),
});
