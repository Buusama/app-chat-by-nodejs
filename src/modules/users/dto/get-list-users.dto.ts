import { PageDto } from 'src/modules/pagination/dto/page.dto';

export class GetListUsersDto extends PageDto {
  search: string;
}
