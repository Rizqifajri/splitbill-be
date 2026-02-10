import { IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";

export class AssignItemDto {
  @IsNotEmpty()
  @IsUUID()
  itemId: string;

  @IsNotEmpty()
  @IsUUID()
  memberId: string;

  @IsNotEmpty()
  @IsOptional()
  @Min(0.1)
  portion: number;
}