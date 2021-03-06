import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  AuthService,
  GqlRequestCtx,
  IRequestCtx,
  PublicApi,
  Roles,
} from '@app/auth';
import { Role } from './constants';
import { CryptoUtils } from '@app/utils';
import { RedisService } from '@app/redis/redis.service';
import { LoginResp } from './dto/login-resp.model';
import { LoginInput } from './dto/login.input';
import { OnApplicationBootstrap } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService, // private readonly redisService: RedisService,
    private authService: AuthService,
    private readonly redisService: RedisService,
  ) {}
  async onApplicationBootstrap() {
    // const JsonStore = await this.redisService.getJsonStore();
    // const { detailInfo, roles, ...obj } = { ...reqCtx.user };
    // const result = await JsonStore.set(`user-${reqCtx.user.id}`, '$', {
    //   ...obj,
    // });
    // console.log('----------1----------', result);
    // console.log(
    //   '----------2----------',
    //   await JsonStore.get(`user-${reqCtx.user.id}`, '$.createdAt'),
    // );
    // console.log(
    //   '----------333----------',
    //   await JsonStore.del(`user-${reqCtx.user.id}`, '$.roles[0].*'),
    // );
    // const StringStore = await this.redisService.getThrottlerStore();
    // console.log(await StringStore.set('key', 'value', 10));
    // console.log(await StringStore.get('key'));
    // console.log(await StringStore.del('key'));
    // console.log(await StringStore.get('key'));
    // console.log(await StringStore.del('key'));
  }

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

  /**
   * 登录接口
   * @param loginData
   * @returns
   */
  @Query(() => LoginResp)
  @PublicApi()
  async login(
    @Args('loginData') loginInput: LoginInput,
    @GqlRequestCtx() reqCtx: IRequestCtx,
  ): Promise<LoginResp> {
    // JWT TOKEN方式
    return this.authService.login(reqCtx, {
      ...loginInput,
    });
  }

  @Query(() => [User], { name: 'users' })
  @Roles<Role>(Role.Member)
  async findAll(@GqlRequestCtx() reqCtx: IRequestCtx<User>) {
    return await this.usersService.findAll(reqCtx);
  }

  @Query(() => User, { name: 'user' })
  @Roles<Role>(Role.Member)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @GqlRequestCtx() reqCtx: IRequestCtx<User>,
  ) {
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
