import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from '../../entities/friend.entity';
import { Message } from '../../entities/message.entity';
import { WebsocketModule } from '../websocket/websocket.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Friend]), WebsocketModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
