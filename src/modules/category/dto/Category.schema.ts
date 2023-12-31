import {IsOptional, IsInt, Min, IsString} from 'class-validator';
import { Transform } from 'class-transformer';

export class CategoryQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  sortByPrice: string;
}
