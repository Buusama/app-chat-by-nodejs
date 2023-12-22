import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { EntityNotFoundErrorFilter } from '../../exception_filters/entity-not-found-error.filter';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { imageFileFilter } from '../../supports/helpers';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { GetListFriendsDto } from './dto/get-list-friends.dto';
import { GetListUsersDto } from './dto/get-list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
@ApiTags('users')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOkResponse({ description: 'List all users' })
  getUsers(
    @Query() getListUsersDto: GetListUsersDto,
    @Req() req,
  ): Promise<PageResponseDto<User>> {
    return this.usersService.getUsers(getListUsersDto, req.user.id);
  }

  @Get('me')
  @ApiOkResponse({ description: 'Get current user' })
  async getCurrentUser(@Req() req): Promise<PageResponseDto<User>> {
    return this.usersService.getProfile(req.user.id);
  }

  @ApiConsumes('multipart/form-data')
  @Patch('me')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'certificate', maxCount: 1 },
      ],
      {
        limits: { fileSize: 20 * 1024 * 1024 /* 20MB */ },
        fileFilter: imageFileFilter,
      },
    ),
  )
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File;
      certificate?: Express.Multer.File;
    },
    @Req() req: any,
  ) {
    return this.usersService.updateMember(req.user.id, updateUserDto, files);
  }

  @Get('friends')
  @ApiOkResponse({ description: 'List all friends' })
  async getFriends(
    @Req() req,
    @Query() getListFriendsDto: GetListFriendsDto,
  ) {
    return this.usersService.getFriends(req.user.id, getListFriendsDto);
  }

  @Get(':id')
  @UseFilters(EntityNotFoundErrorFilter)
  async getMember(@Param('id') user_id: string, @Req() req) {
    return this.usersService.getUser(Number(user_id), req.user.id);
  }
}
