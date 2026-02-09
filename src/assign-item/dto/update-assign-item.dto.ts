import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignItemDto } from './create-assign-item.dto';

export class UpdateAssignItemDto extends PartialType(CreateAssignItemDto) {}
