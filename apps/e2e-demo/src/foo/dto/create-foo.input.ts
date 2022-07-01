import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFooInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
