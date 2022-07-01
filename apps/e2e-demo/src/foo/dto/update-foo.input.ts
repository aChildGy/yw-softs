import { CreateFooInput } from './create-foo.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFooInput extends PartialType(CreateFooInput) {
  @Field(() => Int)
  id: number;
}
