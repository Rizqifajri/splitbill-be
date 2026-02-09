import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignItemService } from './assign-item.service';
import { CreateAssignItemDto } from './dto/create-assign-item.dto';
import { UpdateAssignItemDto } from './dto/update-assign-item.dto';

@Controller('assign-item')
export class AssignItemController {
  constructor(private readonly assignItemService: AssignItemService) {}

  @Post()
  create(@Body() createAssignItemDto: CreateAssignItemDto) {
    return this.assignItemService.create(createAssignItemDto);
  }

  @Get()
  findAll() {
    return this.assignItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignItemDto: UpdateAssignItemDto) {
    return this.assignItemService.update(+id, updateAssignItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignItemService.remove(+id);
  }
}
