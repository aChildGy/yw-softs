import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDetail } from './entities/user.detail.entity';
import { UserRole } from './entities/user-role.entity';
import { RedisModule } from '@app/redis';

@Module({
  // 使用 forFeature() 方法来定义在当前范围内注册的存储库。有了这些，我们可以使用 @InjectRepository() 装饰器将 UsersRepository 注入到 UsersService 中
  imports: [TypeOrmModule.forFeature([User, UserDetail, UserRole])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
