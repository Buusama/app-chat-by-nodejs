import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTextMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  content: string;
}

export class CreateFileMessageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;
}
