import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FooService } from './foo.service';
import { Foo } from './entities/foo.entity';
import { CreateFooInput } from './dto/create-foo.input';
import { UpdateFooInput } from './dto/update-foo.input';

@Resolver(() => Foo)
export class FooResolver {
  constructor(private readonly fooService: FooService) {}

  @Mutation(() => Foo)
  createFoo(@Args('createFooInput') createFooInput: CreateFooInput) {
    return this.fooService.create(createFooInput);
  }

  @Query(() => [Foo], { name: 'foo' })
  findAll() {
    return this.fooService.findAll();
  }

  @Query(() => Foo, { name: 'foo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.fooService.findOne(id);
  }

  @Mutation(() => Foo)
  updateFoo(@Args('updateFooInput') updateFooInput: UpdateFooInput) {
    return this.fooService.update(updateFooInput.id, updateFooInput);
  }

  @Mutation(() => Foo)
  removeFoo(@Args('id', { type: () => Int }) id: number) {
    return this.fooService.remove(id);
  }
}
