import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
  Query,
  UseFilters,
  Post,
  Body,
  Req,
  Delete,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from '../../entities/bookmark.entity';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { EntityNotFoundErrorFilter } from 'src/exception_filters/entity-not-found-error.filter';

@ApiTags('bookmarks')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('users/:id/bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Delete()
  @UseFilters(EntityNotFoundErrorFilter)
  async delete(
    @Param('id') receiver_id: number,
    @Req() req,
  ): Promise<PageResponseDto<Bookmark>> {
    return this.bookmarksService.delete(req.user.id, receiver_id);
  }

  @Post()
  @UseFilters(EntityNotFoundErrorFilter)
  async create(
    @Param('id') receiver_id: number,
    @Req() req,
  ): Promise<PageResponseDto<Bookmark>> {
    return this.bookmarksService.create(req.user.id, receiver_id);
  }
}
