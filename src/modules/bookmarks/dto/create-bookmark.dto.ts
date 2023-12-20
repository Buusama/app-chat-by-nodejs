import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty()
  receiver_id: number;
}
