import { Test, TestingModule } from '@nestjs/testing';
import { AssignItemController } from './assign-item.controller';
import { AssignItemService } from './assign-item.service';

describe('AssignItemController', () => {
  let controller: AssignItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignItemController],
      providers: [AssignItemService],
    }).compile();

    controller = module.get<AssignItemController>(AssignItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
