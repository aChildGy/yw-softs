import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  AuthService,
  GqlRequestCtx,
  IRequestCtx,
  LocalAuthGuard,
  PublicApi,
  Roles,
} from '@app/auth';
import { Role } from './constants';
import { CryptoUtils } from '@app/utils';
import { SkipThrottle } from '@nestjs/throttler';
import { RedisService } from '@app/redis/redis.service';
import { RedisJSON } from '@app/redis/interfaces/redis.interface';
import { LoginResp } from './dto/login-resp.model';
import { UseGuards } from '@nestjs/common';
import { LoginInput } from './dto/login.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, // private readonly redisService: RedisService,
    private authService: AuthService,
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

  /**
   * 登录接口
   * @param createUserInput
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
