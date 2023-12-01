import { SortEnum } from 'src/commons/enums/sort/sort-enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { GlobalEnum } from 'src/commons/enums/global-enum';

export class PageDto {
  @ApiProperty({ required: false })
  public sort_enum: SortEnum;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  public skip: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  public take: number;

  @ApiProperty({ required: false })
  @IsOptional()
  public sort_by?: string;
}
