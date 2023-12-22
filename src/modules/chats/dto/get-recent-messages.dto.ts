import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PageDto } from '../../pagination/dto/page.dto';

export class GetRecentMessagesDto extends PageDto {}
