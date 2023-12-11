import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from '../../entities/bookmark.entity';
import { Friend } from '../../entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Friend])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule { }
