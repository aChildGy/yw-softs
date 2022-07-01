import { Test, TestingModule } from '@nestjs/testing';
import { E2eDemoController } from './e2e-demo.controller';
import { E2eDemoService } from './e2e-demo.service';

describe('E2eDemoController', () => {
  let e2eDemoController: E2eDemoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [E2eDemoController],
      providers: [E2eDemoService],
    }).compile();

    e2eDemoController = app.get<E2eDemoController>(E2eDemoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(e2eDemoController.getHello()).toBe('Hello World!');
    });
  });
});
