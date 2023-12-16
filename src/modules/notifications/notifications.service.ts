import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendStatusValue } from 'src/commons/enums/friend/status-enum';
import { Friend } from 'src/entities/friend.entity';
import { Repository } from 'typeorm';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private ws: WebsocketGateway,
  ) {}

  async getNotifications(userId: number): Promise<PageResponseDto<Friend>> {
    const pendingFriendRequests = await this.friendRepository
      .createQueryBuilder('friend')
      .select([
        'friend.id',
        'sender_id',
        'receiver_id',
        'status',
        'user.id as user_id',
        'user.name',
        'user.avatar',
        'friend.updated_at',
      ])
      .leftJoin('friend.sender', 'user')
      .where('friend.receiver_id = :userId and friend.status = :status', {
        userId,
        status: FriendStatusValue.DANG_CHO,
      })
      .getRawMany();

    const acceptedFriendRequests = await this.friendRepository
      .createQueryBuilder('friend')
      .select([
        'friend.id',
        'sender_id',
        'receiver_id',
        'status',
        'user.id as user_id',
        'user.name',
        'user.avatar',
        'friend.updated_at',
      ])
      .leftJoin('friend.sender', 'user')
      .where('friend.sender_id = :userId and friend.status = :status', {
        userId,
        status: FriendStatusValue.DA_DONG_Y,
      })
      .getRawMany();

    const allFriends = [...pendingFriendRequests, ...acceptedFriendRequests];

    allFriends.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

    return new PageResponseDto(allFriends);
  }
}
