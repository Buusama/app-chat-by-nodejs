import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from '../../entities/friend.entity';
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
    const notifications = await this.friendRepository
      .createQueryBuilder('friend')
      .select([
        'status as type',
        'user.id as id',
        'user.name as name',
        'user.avatar as avatar',
        'friend.updated_at as time',
      ])
      .where(
        '(friend.receiver_id = :userId and status = 1) or (friend.sender_id = :userId and (friend.status = 2 or friend.status = 3))',
        { userId },
      )
      .leftJoin(
        'users',
        'user',
        'user.id = CASE WHEN status = 1 THEN friend.sender_id ELSE friend.receiver_id END',
      )
      .orderBy('friend.updated_at', 'DESC')
      .getRawMany();
    return new PageResponseDto(notifications);
  }
}
