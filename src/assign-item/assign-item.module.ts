import { Module } from '@nestjs/common';
import { AssignItemService } from './assign-item.service';
import { AssignItemController } from './assign-item.controller';

@Module({
  controllers: [AssignItemController],
  providers: [AssignItemService],
})
export class AssignItemModule {}
