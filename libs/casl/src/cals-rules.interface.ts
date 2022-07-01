import { InferSubjects, Ability, AbilityBuilder } from '@casl/ability';

export enum Action {
  All = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects<T> = InferSubjects<T> | 'all';

export type AppAbility<T> = Ability<[Action, Subjects<T>]>;

export type CaslAbility<T> = AbilityBuilder<AppAbility<T>>;

export interface ICaslAbilityRules<U, T> {
  rules: (user: U, caslAbility: CaslAbility<T>) => void;
}

export interface CalsModuleOptions<U, T> {
  /**
   * 构造函数类型 CaslRuleProvider是一个实现了ICaslRules接口的类（不是实例）
   */
  CaslRuleProvider?: new () => ICaslAbilityRules<U, T>;
}

interface IPolicyHandler<T> {
  handle(ability: AppAbility<T>): boolean;
}

type PolicyHandlerCallback<T> = (ability: AppAbility<T>) => boolean;

export type PolicyHandler<T> = IPolicyHandler<T> | PolicyHandlerCallback<T>;
