import { CryptoUtils, DateUtils } from '@app/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from './constants';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

  const createUserInput: CreateUserInput = {
    username: 'lisi',
    password: '123456',
    nickname: '红豆',
  };

  beforeEach(async () => {
    const newUser = new User();
    newUser.createdAt = DateUtils.format();
    newUser.modifyAt = DateUtils.format();
    newUser.username = createUserInput.username;
    newUser.password = await CryptoUtils.generateHash(createUserInput.password);
    newUser.nickname = createUserInput.nickname;
    newUser.id = 1;
    newUser.isActive = true;
    newUser.nowMoney = 0;
    newUser.nowMoneyMantissa = 0;
    newUser.roles = [
      {
        id: 1,
        createdAt: DateUtils.format(),
        roleCode: Role.Member,
        user: newUser,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockImplementation(() => newUser),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('test createUser func,', async () => {
    expect(resolver.createUser).toBeDefined();

    expect((await resolver.createUser(createUserInput)).username).toBe(
      createUserInput.username,
    );

    expect(usersService.create).toHaveReturnedTimes(1);

    // expect(usersService.create).toBeCalledWith({
    //   nickname: '红豆',
    //   password: '123456',
    //   username: 'lisi',
    // });

    // console.log(createUserInput);

    // expect(usersService.create).toBeCalledWith(createUserInput);
  });
});
