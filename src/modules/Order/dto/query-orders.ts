import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
``;

export class OrderQueryDto {
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
    sortBy: string;

    @IsOptional()
    @IsString()
    sortWith: string;
    @IsOptional()
    @IsString()
    sortMinPrice: string;
    @IsOptional()
    @IsString()
    sortMaxPrice: string;

    @IsOptional()
    @IsString()
    status: string;
}
