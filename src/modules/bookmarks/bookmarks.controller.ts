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
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @Post()
  @UseFilters(EntityNotFoundErrorFilter)
  async create(@Body() createBookmarkDto: CreateBookmarkDto, @Req() req,): Promise<PageResponseDto<Bookmark>> {
    const userId = req.user.id;
    return this.bookmarksService.create(createBookmarkDto, userId);
  }
}
