import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export class PageResponseDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[] | T;

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[] | T, meta: PageMetaDto = null) {
    this.data = data;
    this.meta = meta;
  }
}
