import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Inject, Injectable } from '@nestjs/common';
import {
  AppAbility,
  CaslAbility,
  ICaslAbilityRules,
  Subjects,
} from './cals-rules.interface';
import { CASL_RULES_PROVIDER } from './constants';

@Injectable()
export class CaslAbilityFactory<U, T> {
  constructor(
    @Inject(CASL_RULES_PROVIDER)
    private caslAbilityRules: ICaslAbilityRules<U, T>,
  ) {}

  buildAbilityByUser(
    user: U,
    rulesHook?: (user: U, caslRule: CaslAbility<T>) => void,
  ) {
    const caslAbility = new AbilityBuilder<AppAbility<T>>(
      Ability as AbilityClass<AppAbility<T>>,
    );

    const { build } = caslAbility; // can, cannot,

    this.caslAbilityRules.rules(user, caslAbility);

    rulesHook ? rulesHook(user, caslAbility) : null;

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects<T>>,
    });
  }
}

// export interface ForcedSubject<T> {
//   readonly __caslSubjectType__: T;
// }

// type TaggedInterface<T extends string> =
//   | ForcedSubject<T>
//   | {
//       readonly kind: T;
//     }
//   | {
//       readonly __typename: T;
//     };
// type TagName<T> = T extends TaggedInterface<infer U> ? U : never;

// type AnyClass<ReturnType = any> = new (...args: any[]) => ReturnType;

// type SubjectClassWithCustomName<T> = AnyClass & {
//   modelName: T;
// };
// type InferSubjects<T, IncludeTagName extends boolean = false> =
//   | T
//   | (T extends AnyClass<infer I>
//       ?
//           | I
//           | (IncludeTagName extends true
//               ? T extends SubjectClassWithCustomName<infer Name>
//                 ? Name
//                 : TagName<I>
//               : never)
//       : TagName<T>);

// const caslAbilityFactory = new CaslAbilityFactory();

// const user = new User();
// user.id = 1;
// user.isAdmin = false;

// const ability = caslAbilityFactory.buildRules(() => null);

// console.log(ability.can(Action.Read, 'all'));

// console.log(ability.can(Action.Read, Article));
// console.log(ability.can(Action.Delete, Article));
// console.log(ability.can(Action.Create, Article));

// const user2 = new User();
// user2.id = 2;
// user2.isAdmin = false;
// console.log('-=-=-=--==-', ability.can(Action.Update, user2));
// console.log('-=-=-3=--==-', ability.can(Action.Delete, user2));

// const attrsTypeObj = {
//   label: 'name',
//   birth: 'age',
//   other: 'other',
// } as const; // 使用 as const 转为字面量类型

// // 创建一个联合类型
// type TAttrType = Record<typeof attrsTypeObj['label'], string> &
//   Record<typeof attrsTypeObj['birth'], number> &
//   // 除了 label 和 birth 之外的 key 都设置为 any 类型
//   Record<
//     typeof attrsTypeObj[Exclude<keyof typeof attrsTypeObj, 'label' | 'birth'>],
//     any
//   >;

// // 复制一个类型，设置属性为可选，增加灵活性
// type TPartialAttrType = Partial<TAttrType>;

// // 不报错，类型符合
// const attrObj: TPartialAttrType = { name: 'haha', age: 15, other: [] };
// // 错误，name 类型不符合，不存在 age1 属性
// // const attrObj1: TPartialAttrType = { name: 123, age1: 15 };
