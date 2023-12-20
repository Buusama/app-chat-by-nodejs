import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../../../entities/user.entity';
import { IsUnique } from '../../../validators/unique-column.validator';

export class AuthRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user1@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @IsUnique(User)
  email: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string;
}
