import { Test, TestingModule } from '@nestjs/testing';
import { TooService } from './too.service';

describe('TooService', () => {
  let service: TooService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TooService],
    }).compile();

    service = module.get<TooService>(TooService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
