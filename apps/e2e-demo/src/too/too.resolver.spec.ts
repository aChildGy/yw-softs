import { Test, TestingModule } from '@nestjs/testing';
import { TooResolver } from './too.resolver';
import { TooService } from './too.service';

describe('TooResolver', () => {
  let resolver: TooResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TooResolver, TooService],
    }).compile();

    resolver = module.get<TooResolver>(TooResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
