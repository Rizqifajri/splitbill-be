import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class UpdateItemDto {
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  price?: number;

  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  quantity?: number;
}