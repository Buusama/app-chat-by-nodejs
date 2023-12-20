import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from '../../entities/friend.entity';
import { User } from '../../entities/user.entity';
import { WebsocketModule } from '../websocket/websocket.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend]), WebsocketModule],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
