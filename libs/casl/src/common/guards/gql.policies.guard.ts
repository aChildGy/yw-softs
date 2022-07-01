import { PolicyHandler, AppAbility } from '@app/casl/cals-rules.interface';
import { CaslAbilityFactory } from '@app/casl/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '@app/casl/constants';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlPoliciesGuard<U, T> implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory<U, T>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.getAllAndOverride<PolicyHandler<T>[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    const ability = this.caslAbilityFactory.buildAbilityByUser(<U>user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler<T>, ability: AppAbility<T>) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
