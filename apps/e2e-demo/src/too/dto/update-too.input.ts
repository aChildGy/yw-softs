import { CreateTooInput } from './create-too.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTooInput extends PartialType(CreateTooInput) {
  @Field(() => Int)
  id: number;
}
