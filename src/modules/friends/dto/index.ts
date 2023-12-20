import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { FriendStatusValue } from '../../../commons/enums/friend/status-enum';

export class ReplyFriendsDto {
  @ApiProperty({ enum: FriendStatusValue })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  status?: number = 0;
}
