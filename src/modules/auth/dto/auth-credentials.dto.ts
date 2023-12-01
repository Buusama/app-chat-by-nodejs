import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'user1@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string;
}
