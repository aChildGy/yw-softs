import { DynamicModule, Module } from '@nestjs/common';
import { CalsModuleOptions, ICaslAbilityRules } from './cals-rules.interface';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CASL_RULES_PROVIDER } from './constants';

class neverCaslRule<U, T> implements ICaslAbilityRules<U, T> {
  rules(): void {
    return null;
  }
}

@Module({})
export class CaslModule {
  static register<U, T>(
    calsModuleOptions: CalsModuleOptions<U, T>,
  ): DynamicModule {
    return {
      module: CaslModule,
      global: true,
      providers: [
        CaslAbilityFactory,
        {
          provide: CASL_RULES_PROVIDER,
          useClass: calsModuleOptions.CaslRuleProvider || neverCaslRule,
        },
      ],
      exports: [CaslAbilityFactory],
    };
  }
}
