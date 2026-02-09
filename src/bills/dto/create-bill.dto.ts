import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsUUID, IsArray, ValidateNested } from 'class-validator';

//buat item : ada harga, nama item nya, sama quantity nya berapa
export class ItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}


export class CreateBillDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  taxRate?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  serviceRate?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @IsString()
  @IsOptional()
  paymentDetails?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  memberNames?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items?: ItemDto[];

}