import { IAuthUserService, IRequestCtx } from '@app/auth';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Role } from './constants';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UsersService implements IAuthUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 创建基本账户
   * @param createUserInput
   * @returns
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    const userRepos = this.userRepository;

    const user = await userRepos.findOne({
      where: { username: createUserInput.username },
    });

    if (user) {
      throw new BadRequestException('用户名已存在');
    }

    const newUser = new User();
    newUser.password = createUserInput.password;
    newUser.username = createUserInput.username;
    newUser.nickname = createUserInput.nickname;

    return await userRepos.save(this.setUserRoleAndGetUser(newUser));
  }

  /**
   * 通过标识返回用户
   * @param usernameOrId 当标识为string时，按用户名查找，当标识为number时，按id查找
   */
  async findOne(reqCtx: IRequestCtx, username: string): Promise<User>;
  async findOne(reqCtx: IRequestCtx, id: number): Promise<User>;
  async findOne(
    reqCtx: IRequestCtx,
    usernameOrId: string | number,
  ): Promise<User> {
    reqCtx.logger.log(`----------UsersService.findOne`, UsersService.name);

    const userRepos = this.userRepository;
    const where = Object.create(null);
    if (typeof usernameOrId === 'string') {
      where.username = usernameOrId;
    } else if (typeof usernameOrId === 'number') {
      where.id = usernameOrId;
    }

    const user = await userRepos.findOne({
      where,
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async findUserByUsername(
    reqCtx: IRequestCtx,
    username: string,
  ): Promise<User> {
    return await this.findOne(reqCtx, username);
  }

  async findAll(reqCtx: IRequestCtx) {
    // this.logger.error('------------->,This action returns all users', 'stack');
    const userRepos = this.userRepository;

    return await userRepos.find({
      relations: {
        roles: true,
      },
    });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    const logger = new Logger(UsersService.name);
    logger.log(updateUserInput);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  setUserRoleAndGetUser(user: User): User {
    // 设定用户默认角色
    const userRole = new UserRole();
    userRole.roleCode = Role.Member;
    userRole.user = user;
    user.roles = [userRole];
    return user;
  }
}
