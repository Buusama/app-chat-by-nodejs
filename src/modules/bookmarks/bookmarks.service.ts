import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PageMetaDto } from '../pagination/dto/page-meta.dto';
import { PageService } from '../pagination/page.service';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Friend } from 'src/entities/friend.entity';
import { FriendStatusValue } from 'src/commons/enums/friend/status-enum';

@Injectable()
export class BookmarksService extends PageService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) {
    super();
  }
  findBookmarks(senderId: number, receiverId: number): Promise<Bookmark> {
    return this.bookmarksRepository.findOneBy({
      sender_id: senderId,
      receiver_id: receiverId,
    });
  }
  async create(
    createBookmarkDto: CreateBookmarkDto,
    userId: number,
  ): Promise<PageResponseDto<Bookmark>> {
    const { ...params } = createBookmarkDto;
    const findBookmarks = await this.findBookmarks(userId, params.receiver_id);
    const friend = await this.friendRepository.findOneBy({
      sender_id: userId,
      receiver_id: params.receiver_id,
    });
    if (!friend || friend.status === FriendStatusValue.DA_DONG_Y) {
      throw new BadRequestException(
        'Các bạn chưa là bạn bè, không thể bookmark',
      );
    }
    if (findBookmarks) {
      await this.bookmarksRepository.delete(findBookmarks.id);
      return new PageResponseDto(findBookmarks);
    }
    const bookmark = this.bookmarksRepository.create(params);
    bookmark.sender_id = userId;
    await this.bookmarksRepository.save(bookmark);
    return new PageResponseDto(bookmark);
  }
}
