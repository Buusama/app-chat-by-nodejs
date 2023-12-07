import { ApiProperty } from '@nestjs/swagger';
import { GenderLabel, GenderValue } from 'src/commons/enums/user/gender-enum';
import { LevelValue } from 'src/commons/enums/user/level-enum';
import { NationalityLabel } from 'src/commons/enums/user/nationality-enum';
import { ProvinceLabel } from 'src/commons/enums/user/province-enum';
import { PageDto } from 'src/modules/pagination/dto/page.dto';

export class GetListUsersDto extends PageDto {
  @ApiProperty({ required: false, enum: LevelValue })
  level: string;

  @ApiProperty({ required: false, enum: GenderValue })
  gender: string;

  @ApiProperty({ required: false })
  age: number;

  @ApiProperty({ required: false, enum: NationalityLabel })
  nationality: string;

  @ApiProperty({ required: false, enum: ProvinceLabel })
  province: string;
}
