import { Action, CaslAbility, ICaslAbilityRules } from '@app/casl';
import { User } from '../entities/user.entity';
import { RulesType } from './ability.rules.type.interfaces';

/**
 * 角色授权规则
 * 用户 --> [ 角色1, 角色2 ]， 角色 --> [ 权限1, 权限2 ]
 */
export class AuthRules implements ICaslAbilityRules<User, RulesType> {
  // 定义权限行为
  rules(user: User, caslAbility: CaslAbility<RulesType>) {
    // 未登录或者用户获取异常，禁止访问任何资源
    if (!user) {
      caslAbility.cannot(Action.All, 'all');
    }
    // // 超级管理员角色具有所有资源操作权限
    // if (user.roles.includes(Role.SuperAdmin)) {
    //   caslAbility.can(Action.All, 'all');
    // }

    // // 一般管理员角色的权限
    // if (user.roles.includes(Role.Admin)) {
    //   caslAbility.can(Action.All, 'all');
    // }

    // // 经销商角色的权限
    // if (user.roles.includes(Role.Dealer)) {
    //   caslAbility.can(Action.All, 'all');
    // }
    // // 注册会员角色的权限
    // if (user.roles.includes(Role.Member)) {
    //   caslAbility.can(Action.All, 'all');
    // }
  }
}
