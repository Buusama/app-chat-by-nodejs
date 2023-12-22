import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({ required: false, type: 'string' })
  name?: string;

  @ApiProperty({ required: false, type: 'string' })
  gender: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  avatar?: any;

  @ApiProperty({ required: false, type: 'string' })
  phone: string;

  @ApiProperty({ required: false, type: 'string' })
  level: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  certificate?: any;

  @ApiProperty({ required: false, type: 'string' })
  province: string;

  @ApiProperty({ required: false, type: 'string' })
  birthday: Date;

  @ApiProperty({ required: false, type: 'string' })
  nationality: string;
}
