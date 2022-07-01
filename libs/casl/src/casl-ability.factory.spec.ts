import { Test, TestingModule } from '@nestjs/testing';
import { Action, CaslAbility, ICaslAbilityRules } from './cals-rules.interface';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CASL_RULES_PROVIDER } from './constants';

class User {
  id: number;
  isAdmin: boolean;
}

class Article {
  id: number;
  isPublished: boolean;
  authorId: number;
}

type TT = typeof User | typeof Article;

class CR implements ICaslAbilityRules<User, TT> {
  // rules: (caslRule: CaslRule<typeof User>) => void;
  rules(user: User, caslRule: CaslAbility<TT>) {
    caslRule.can(Action.Read, User);
    caslRule.can(Action.Update, Article, { authorId: user.id });
  }
}

describe('CaslAbilityFactory', () => {
  let abilityFactoryService: CaslAbilityFactory<User, TT>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaslAbilityFactory,
        {
          provide: CASL_RULES_PROVIDER,
          useClass: CR,
        },
      ],
    }).compile();

    abilityFactoryService = module.get(CaslAbilityFactory);
  });

  it('should be defined', () => {
    const user = new User();
    user.id = 1;

    const article = new Article();
    article.authorId = 1;
    article.id = 1;

    const ability = abilityFactoryService.buildAbilityByUser(user);

    expect(ability.can(Action.Read, user)).toBe(true);
    expect(ability.can(Action.Update, article)).toBe(true);

    article.authorId = 2;
    expect(ability.can(Action.Update, article)).toBe(false);
  });
});
