import { Test, TestingModule } from '@nestjs/testing';
import { MessController } from './mess.controller';

describe('MessController', () => {
  let controller: MessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessController],
    }).compile();

    controller = module.get<MessController>(MessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
