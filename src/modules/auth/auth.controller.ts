import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/register')
  signUp(
    @Body() authRegisterDto: AuthRegisterDto,
  ): Promise<PageResponseDto<User>> {
    return this.authService.signUp(authRegisterDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getProfile(@Req() req): Promise<User> {
    return this.authService.getProfile(req.user);
  }
}
