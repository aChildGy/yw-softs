import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TooService } from './too.service';
import { Too } from './entities/too.entity';
import { CreateTooInput } from './dto/create-too.input';
import { UpdateTooInput } from './dto/update-too.input';

@Resolver(() => Too)
export class TooResolver {
  constructor(private readonly tooService: TooService) {}

  @Mutation(() => Too)
  createToo(@Args('createTooInput') createTooInput: CreateTooInput) {
    return this.tooService.create(createTooInput);
  }

  @Query(() => [Too], { name: 'too' })
  findAll() {
    return this.tooService.findAll();
  }

  @Query(() => Too, { name: 'too' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tooService.findOne(id);
  }

  @Mutation(() => Too)
  updateToo(@Args('updateTooInput') updateTooInput: UpdateTooInput) {
    return this.tooService.update(updateTooInput.id, updateTooInput);
  }

  @Mutation(() => Too)
  removeToo(@Args('id', { type: () => Int }) id: number) {
    return this.tooService.remove(id);
  }
}
