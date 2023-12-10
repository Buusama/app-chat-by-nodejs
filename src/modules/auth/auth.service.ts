import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './interfaces/auth-payload.interface';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { PageResponseDto } from '../pagination/dto/page-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string, user: any }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: AuthPayload = {
        id: user.id,
        email: user.email,
      };

      const accessToken: string = await this.jwtService.sign(payload);
      const UserInfo: any = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      }
      return { access_token: accessToken, user: UserInfo };
    } else {
      throw new UnauthorizedException('Please check');
    }
  }

  async signUp(
    authRegisterDto: AuthRegisterDto,
  ): Promise<PageResponseDto<User>> {
    const { ...params } = authRegisterDto;
    const user = this.usersRepository.create(params);

    await this.usersRepository.save(user);
    return new PageResponseDto(user);
  }

  async getProfile(user: User): Promise<User> {
    return user;
  }
}
