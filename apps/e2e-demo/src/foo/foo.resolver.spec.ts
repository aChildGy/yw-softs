import { Test, TestingModule } from '@nestjs/testing';
import { FooResolver } from './foo.resolver';
import { FooService } from './foo.service';

describe('FooResolver', () => {
  let resolver: FooResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FooResolver, FooService],
    }).compile();

    resolver = module.get<FooResolver>(FooResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
