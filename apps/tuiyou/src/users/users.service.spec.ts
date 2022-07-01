import { Utils } from '@app/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './constants';
import { CreateUserInput } from './dto/create-user.input';
import { UserDetail } from './entities/user.detail.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const obj: User = {
  id: 1,
  createdAt: '',
  modifyAt: '',
  username: 'zhangsan',
  phone: '',
  password: '1231245',
  nickname: '',
  nowMoney: 0,
  nowMoneyMantissa: 0,
  detailInfo: new UserDetail(),
  roles: [],
  isActive: false,
};

const objs: User[] = [obj];

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const providers = [];

    providers.push(
      // 数据库隔离测试
      {
        provide: getRepositoryToken(User),
        useValue: {
          find: jest.fn().mockResolvedValue(objs),
          findOne: jest.fn().mockImplementation((cond) => {
            if (cond.where?.username) {
              const username = cond.where.username;
              return objs.filter((obj) => obj.username === username)[0];
            }
            return obj;
          }),
          save: jest.fn().mockImplementation((_) => _),
          remove: jest.fn(),
          delete: jest.fn(),
        },
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ...providers],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('test setUserRoleAndGetUser func', () => {
    // 设定默认角色
    const user = service.setUserRoleAndGetUser(obj);
    expect(user.roles[0]).toEqual(obj.roles[0]);
  });
  it('test create User func,用户名不存在', async () => {
    const user: CreateUserInput = {
      username: '张三三',
      password: '123456',
      nickname: '三哥',
    };
    // 创建用户 存储到数据库
    const result = await service.create(user);
    expect(userRepository.save).toHaveReturnedTimes(1);
    // 返回保存的用户
    expect(result.username).toBe(user.username);
    expect(result.roles[0].roleCode).toBe(Role.Member);
  });

  it('test create User func,用户名已存在,抛出异常,方式1', async () => {
    const user: CreateUserInput = {
      username: 'zhangsan',
      password: '123456',
      nickname: '三哥',
    };

    // 创建用户 存储到数据库
    await expect(async () => await service.create(user)).rejects.toThrowError(
      '用户名已存在',
    );
  });

  it('test create User func,用户名已存在,方式2', async () => {
    const user: CreateUserInput = {
      username: 'zhangsan',
      password: '123456',
      nickname: '三哥',
    };

    const createUserSync = await Utils.syncify(service.create, service, user);

    expect(createUserSync).toThrow('用户名已存在');
  });
});
