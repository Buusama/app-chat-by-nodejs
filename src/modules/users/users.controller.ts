import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
  Query,
  UseFilters,
  Body,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetListUsersDto } from './dto/get-list-users.dto';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { EntityNotFoundErrorFilter } from 'src/exception_filters/entity-not-found-error.filter';

@ApiTags('users')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'List all users' })
  getUsers(
    @Query() getListUsersDto: GetListUsersDto,
    @Req() req,
  ): Promise<PageResponseDto<User>> {
    return this.usersService.getUsers(getListUsersDto, req.user.id);
  }

  @Get(':id')
  @UseFilters(EntityNotFoundErrorFilter)
  async getMember(@Param('id') user_id: string, @Req() req) {
    return this.usersService.getUser(Number(user_id), req.user.id);
  }
}
