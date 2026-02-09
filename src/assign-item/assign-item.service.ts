import { Injectable } from '@nestjs/common';
import { CreateAssignItemDto } from './dto/create-assign-item.dto';
import { UpdateAssignItemDto } from './dto/update-assign-item.dto';

@Injectable()
export class AssignItemService {
  create(createAssignItemDto: CreateAssignItemDto) {
    return 'This action adds a new assignItem';
  }

  findAll() {
    return `This action returns all assignItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignItem`;
  }

  update(id: number, updateAssignItemDto: UpdateAssignItemDto) {
    return `This action updates a #${id} assignItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignItem`;
  }
}
