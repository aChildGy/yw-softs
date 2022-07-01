import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './cals-rules.interface';

export const CASL_RULES_PROVIDER = 'CASL_RULES_PROVIDER';

export const CHECK_POLICIES_KEY = 'check_policy';

/**
 * 权限检查装饰器
 * @param handlers
 * @returns
 */
export const CheckPolicies = <T>(...handlers: PolicyHandler<T>[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
