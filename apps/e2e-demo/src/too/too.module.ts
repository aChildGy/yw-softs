import { Module } from '@nestjs/common';
import { TooService } from './too.service';
import { TooResolver } from './too.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Too } from './entities/too.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Too])],
  providers: [TooResolver, TooService],
})
export class TooModule {}
