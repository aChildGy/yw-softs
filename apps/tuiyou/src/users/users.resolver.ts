import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlRequestCtx, IRequestCtx, PublicApi, Roles } from '@app/auth';
import { Role } from './constants';
import { CryptoUtils } from '@app/utils';
import { SkipThrottle } from '@nestjs/throttler';
import { RedisService } from '@app/redis/redis.service';
import { RedisJSON } from '@app/redis/interfaces/redis.interface';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, // private readonly redisService: RedisService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 注册用户接口
   * @param createUserInput
   * @returns
   */
  @Mutation(() => User)
  @PublicApi()
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const createUser: CreateUserInput = { ...createUserInput };
    // 把密码做加密处理
    createUser.password = await CryptoUtils.generateHash(
      createUserInput.password,
    );

    return await this.usersService.create(createUser);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @Roles<Role>(Role.Member)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @GqlRequestCtx() reqCtx: IRequestCtx,
  ) {
    const JsonStore = await this.redisService.getJsonStore();
    const obj = { ...reqCtx.user, payPassword: 11 };
    const result = await JsonStore.set(`user-${reqCtx.user.id}`, '$', obj, {
      XX: true,
    });

    reqCtx.logger.log(`----------UsersResolver.findOne`, UsersResolver.name);
    return this.usersService.findOne(reqCtx, id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
