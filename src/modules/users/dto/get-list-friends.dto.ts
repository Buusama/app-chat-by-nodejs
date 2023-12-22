import { ApiProperty } from '@nestjs/swagger';

export class GetListFriendsDto  {
  @ApiProperty({ required: false })
  search: string;
}
