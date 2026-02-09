import { Test, TestingModule } from '@nestjs/testing';
import { AssignItemService } from './assign-item.service';

describe('AssignItemService', () => {
  let service: AssignItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignItemService],
    }).compile();

    service = module.get<AssignItemService>(AssignItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
