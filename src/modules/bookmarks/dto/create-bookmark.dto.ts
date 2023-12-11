import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from 'src/modules/pagination/dto/page.dto';

export class CreateBookmarkDto {
  @ApiProperty()
  receiver_id: number;
}
