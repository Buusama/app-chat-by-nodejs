import {
  BadRequestException,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendStatusValue } from 'src/commons/enums/friend/status-enum';
import { Friend } from 'src/entities/friend.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { PageResponseDto } from '../pagination/dto/page-response.dto';
import { UsersService } from '../users/users.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { ReplyFriendsDto } from './dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private ws: WebsocketGateway,
  ) { }
  async addFriend(userId: number, receiver_id: number): Promise<PageResponseDto<Friend>> {
    const user = this.usersRepository.findOneBy({ id: receiver_id });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const friend = await this.friendRepository.findOneBy({
      sender_id: userId,
      receiver_id,
    });
    if (friend) {
      throw new BadRequestException('Bạn đã gửi lời mời kết bạn');
    }
    const friend2 = await this.friendRepository.findOneBy({
      sender_id: receiver_id,
      receiver_id: userId,
    });
    if (friend2) {
      throw new BadRequestException('Bạn đã nhận được lời mời kết bạn');
    }

    const newFriend = this.friendRepository.create({
      sender_id: userId,
      receiver_id,
      status: FriendStatusValue.DANG_CHO,
    });
    await this.friendRepository.save(newFriend);
    this.ws.serverSendEvent('addFriend', {
      sender_id: userId,
      receiver_id,
      status: FriendStatusValue.DANG_CHO,
    }, [`socket-channel-for-user-${receiver_id}`]);
    return new PageResponseDto(newFriend);
  }

  async replyFriend(userId: number, sender_id: number, replyFriendsDto: ReplyFriendsDto): Promise<PageResponseDto<Friend>> {
    const user = await this.usersRepository.findOneBy({ id: sender_id });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const friend = await this.friendRepository.findOneBy({
      sender_id,
      receiver_id: userId,
    });
    if (!friend) {
      throw new BadRequestException('Bạn chưa nhận được lời mời kết bạn');
    }
    if (replyFriendsDto.status === FriendStatusValue.DA_TU_CHOI) {
      await this.friendRepository.update(friend.id, {
        status: FriendStatusValue.DA_TU_CHOI,
      });
    }
    if (replyFriendsDto.status === FriendStatusValue.DA_DONG_Y) {
      await this.friendRepository.update(friend.id, {
        status: FriendStatusValue.DA_DONG_Y,
      });
    }
    this.ws.serverSendEvent('replyFriend', {
      sender_id: sender_id,
      receiver_id: userId,
      status: replyFriendsDto.status,
    }, [`socket-channel-for-user-${userId}`]);
    return new PageResponseDto(friend);
  }

  async getFriendsRequest(userId: number): Promise<PageResponseDto<Friend>> {
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
      .where('friend.receiver_id = :userId and friend.status = :status', { userId, status: FriendStatusValue.DANG_CHO })
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
      .where('friend.sender_id = :userId and friend.status = :status', { userId, status: FriendStatusValue.DA_DONG_Y })
      .getRawMany();

    const allFriends = [...pendingFriendRequests, ...acceptedFriendRequests];

    allFriends.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return new PageResponseDto(allFriends);
  }

}
