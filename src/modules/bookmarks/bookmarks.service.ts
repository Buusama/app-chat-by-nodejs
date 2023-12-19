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
import { User } from 'src/entities/user.entity';

@Injectable()
export class BookmarksService extends PageService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    userId: number,
    receiver_id: number,
  ): Promise<PageResponseDto<Bookmark>> {
    const user = this.usersRepository.findOneBy({ id: receiver_id });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const friend1 = await this.friendRepository.findOneBy({
      sender_id: userId,
      receiver_id: receiver_id,
      status: FriendStatusValue.DA_DONG_Y,
    });
    const friend2 = await this.friendRepository.findOneBy({
      sender_id: receiver_id,
      receiver_id: userId,
      status: FriendStatusValue.DA_DONG_Y,
    });
    if (!friend1 && !friend2) {
      throw new BadRequestException('Chưa là bạn bè');
    }
    const findBookmarks = await this.findBookmarks(userId, receiver_id);
    if (findBookmarks) {
      throw new BadRequestException('Bookmark đã tồn tại');
    }
    const bookmark = await this.bookmarksRepository.save({
      sender_id: userId,
      receiver_id: receiver_id,
    });
    return new PageResponseDto(bookmark);
  }

  async delete(
    userId: number,
    receiver_id: number,
  ): Promise<PageResponseDto<Bookmark>> {
    const user = this.usersRepository.findOneBy({ id: receiver_id });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const friend1 = await this.friendRepository.findOneBy({
      sender_id: userId,
      receiver_id: receiver_id,
      status: FriendStatusValue.DA_DONG_Y,
    });
    const friend2 = await this.friendRepository.findOneBy({
      sender_id: receiver_id,
      receiver_id: userId,
      status: FriendStatusValue.DA_DONG_Y,
    });
    if (!friend1 && !friend2) {
      throw new BadRequestException('Chưa là bạn bè');
    }
    const findBookmarks = await this.findBookmarks(userId, receiver_id);
    if (!findBookmarks) {
      throw new BadRequestException('Bookmark không tồn tại');
    }
    await this.bookmarksRepository.delete({ id: findBookmarks.id });
    return new PageResponseDto(findBookmarks);
  }
}
