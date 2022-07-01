import { Module } from '@nestjs/common';
import { FooService } from './foo.service';
import { FooResolver } from './foo.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foo } from './entities/foo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foo])],
  providers: [FooResolver, FooService],
})
export class FooModule {}
