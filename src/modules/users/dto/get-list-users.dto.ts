import { ApiProperty } from '@nestjs/swagger';
import { GenderValue } from '../../../commons/enums/user/gender-enum';
import { LevelValue } from '../../../commons/enums/user/level-enum';
import { NationalityLabel } from '../../../commons/enums/user/nationality-enum';
import { ProvinceValue } from '../../../commons/enums/user/province-enum';
import { PageDto } from '../../../modules/pagination/dto/page.dto';

export class GetListUsersDto extends PageDto {
  @ApiProperty({ required: false, enum: LevelValue })
  level: string;

  @ApiProperty({ required: false, enum: GenderValue })
  gender: number;

  @ApiProperty({ required: false })
  age: number;

  @ApiProperty({ required: false, enum: NationalityLabel })
  nationality: string;

  @ApiProperty({ required: false, enum: ProvinceValue })
  province: number;

  @ApiProperty({ required: false })
  search: string;
}
